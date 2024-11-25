-- policy: (auth.jwt() ->> 'user_role') = 'admin'

create type public.status as enum ('activo', 'inactivo', 'pendiente');
create type public.tasks_status as enum ('pendiente', 'en_proceso', 'completado');
create type public.roles as enum ('admin', 'moderador', 'asociado');
create type public.relationships as enum ('padre', 'madre', 'tutor', 'apoderado');

create type public.activity_type as enum ( 'reunion', 'evento', 'taller', 'seminario', 'curso', 'encuentro', 'actividad_deportiva', 'voluntariado', 'recreativa', 'otro'
);

create table public.activities (
  activity_id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  activity_type public.activity_type default 'evento' not null,
  activity_date date not null,
  start_time time,
  end_time time,
  location text,
  status public.status default 'activo' not null,
  created_at timestamp default current_timestamp
);
alter table public.activities enable row level security;


create table public.partners (
  partner_id uuid primary key,
  identity_card text unique not null,
  names text not null,
  last_names text not null,
  dob date not null,
  phone text not null,
  email text not null,
  address text not null,
  education_level text not null,
  occupation text not null,
  marital_status text not null,
  status public.status default 'activo' not null
);
alter table public.partners enable row level security;

create table public.students (
  student_id uuid default uuid_generate_v4() primary key,
  partner_id uuid references public.partners on delete cascade,
  relationship_type public.relationships not null,
  identity_card text unique not null,
  names text not null,
  last_names text not null,
  dob date not null,
  school_grade text not null,
  health_info text not null
);
alter table public.students enable row level security;

create table public.user_profiles (
  user_id uuid references auth.users on delete cascade primary key,
  partner_id uuid references public.partners,
  name text,
  email text unique not null,
  reg_code text,
  role public.roles default 'asociado' not null,
  created_at timestamptz default now()
);
alter table public.user_profiles enable row level security;

create table public.temp_data (
  partner_id uuid default uuid_generate_v4() primary key,
  identity_card text unique not null,
  names text not null,
  last_names text not null,
  dob date not null,
  phone text not null,
  email text not null,
  address text not null,
  education_level text not null,
  occupation text not null,
  marital_status text not null,
  children jsonb,
  status public.status default 'pendiente' not null,
  enrollment_date timestamptz default now()
);
alter table public.temp_data enable row level security;

create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
stable
as $$
declare
  claims jsonb := event->'claims';
  user_role public.roles;
  p_id uuid;
  user_name text;
begin
  -- fetch the user role and partner id from the user_profiles table
  select role, partner_id, name into user_role, p_id, user_name
  from public.user_profiles 
  where user_id = (event->>'user_id')::uuid;

  -- set user_role claim if available
  claims := jsonb_set(claims, '{user_role}', 
    coalesce(to_jsonb(user_role), 'null'::jsonb));

  -- set partner_id claim if available
  claims := jsonb_set(claims, '{partner_id}', 
    coalesce(to_jsonb(p_id), 'null'::jsonb));

  -- set user_name claim if available
  claims := jsonb_set(claims, '{user_name}', 
    coalesce(to_jsonb(user_name), 'null'::jsonb));

  -- update the 'claims' object in the original event
  event := jsonb_set(event, '{claims}', claims);

  -- return the modified event
  return event;
end;
$$;

grant all
  on table public.user_profiles
  to supabase_auth_admin;

create policy "Enable read access for auth" on public.user_profiles
as permissive for select
to supabase_auth_admin
using (true);

create policy "Enable read access for admins" on public.user_profiles
as permissive for select
to authenticated
using ((auth.jwt() ->> 'user_role') = 'admin');

create or replace function public.create_profile()
returns trigger
language plpgsql security definer set search_path = ''
as $$
declare
  partner_id uuid;
begin

  partner_id := (new.raw_user_meta_data ->> 'partner_id')::uuid;

  if partner_id is not null then
    perform public.process_temp_data(partner_id);
  end if;
  
  insert into public.user_profiles (
    user_id,
    partner_id,
    name,
    email,
    reg_code,
    role,
    created_at
  ) values (
    new.id,
    partner_id,
    new.raw_user_meta_data ->> 'name',
    new.email,
    new.raw_user_meta_data ->> 'reg_code',
   'asociado',
    new.created_at
  );

  return new;
end;
$$;

create trigger trigger_create_profile
  after insert on auth.users
  for each row execute procedure public.create_profile();

create or replace function public.generate_code()
returns text
language plpgsql security definer set search_path = ''
as $$
declare
  count_partners int;
  new_reg_code text;
begin
  select count(*) into count_partners from public.partners;
  new_reg_code := 'CRAF' || lpad((count_partners + 1)::text, 4, '0');
  return new_reg_code;
end;
$$;

create or replace function public.process_temp_data(p_partner_id uuid)
returns void
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.partners (
    partner_id,
    identity_card,
    names,
    last_names,
    dob,
    phone,
    email,
    address,
    education_level,
    occupation,
    marital_status,
    status
  )
  select
    partner_id,
    identity_card,
    names,
    last_names,
    dob,
    phone,
    email,
    address,
    education_level,
    occupation,
    marital_status,
    status
  from public.temp_data
  where partner_id = p_partner_id
  on conflict (identity_card) do nothing;

  insert into public.students (
    partner_id,
    relationship_type,
    identity_card,
    names,
    last_names,
    dob,
    school_grade,
    health_info
  )
  select
    partner_id,
    (student->>'relationship_type')::public.relationships as relationship_type,
    student->>'identity_card' as identity_card,
    student->>'names' as names,
    student->>'last_names' as last_names,
    (student->>'dob')::date as dob,
    student->>'school_grade' as school_grade,
    student->>'health_info' as health_info
  from public.temp_data,
  lateral jsonb_array_elements(children) as student
  where partner_id = p_partner_id;

  delete from public.temp_data where partner_id = p_partner_id;
end;
$$;

create or replace function public.get_all_partners()
returns table (
  partner_id uuid,
  reg_code text,
  role text,
  identity_card text,
  names text,
  last_names text,
  dob date,
  phone text,
  email text,
  address text,
  education_level text,
  occupation text,
  marital_status text,
  status text,
  created_at timestamptz,
  children jsonb
)
language plpgsql
security definer set search_path = ''
as $$
begin
  return query
  select
    p.partner_id,
    up.reg_code,
    up.role::text,
    p.identity_card,
    p.names,
    p.last_names,
    p.dob,
    p.phone,
    p.email,
    p.address,
    p.education_level,
    p.occupation,
    p.marital_status,
    p.status::text,
    up.created_at,
    coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'student_id', s.student_id,
            'relationship_type', s.relationship_type,
            'identity_card', s.identity_card,
            'names', s.names,
            'last_names', s.last_names,
            'dob', s.dob,
            'school_grade', s.school_grade,
            'health_info', s.health_info
          )
        )
        from public.students s
        where s.partner_id = p.partner_id
      ), '[]'::jsonb
    ) as children
  from public.partners p
  left join public.user_profiles up on up.partner_id = p.partner_id;
end;
$$;

create or replace function public.get_filtered_partner(
  p_partner_id uuid default null,
  p_partner_identity_card text default null
)
returns table (
  partner_id uuid,
  reg_code text,
  role text,
  identity_card text,
  names text,
  last_names text,
  dob date,
  phone text,
  email text,
  address text,
  education_level text,
  occupation text,
  marital_status text,
  status text,
  created_at timestamptz,
  children jsonb
)
language plpgsql
security definer set search_path = ''
as $$
begin
  return query
  select
    p.partner_id,
    up.reg_code,
    up.role::text,
    p.identity_card,
    p.names,
    p.last_names,
    p.dob,
    p.phone,
    p.email,
    p.address,
    p.education_level,
    p.occupation,
    p.marital_status,
    p.status::text,
    up.created_at,
    coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'student_id', s.student_id,
            'relationship_type', s.relationship_type,
            'identity_card', s.identity_card,
            'names', s.names,
            'last_names', s.last_names,
            'dob', s.dob,
            'school_grade', s.school_grade,
            'health_info', s.health_info
          )
        )
        from public.students s
        where s.partner_id = p.partner_id
      ), '[]'::jsonb
    ) as children
  from public.partners p
  left join public.user_profiles up on up.partner_id = p.partner_id
  where
    (p_partner_id is null or p.partner_id = p_partner_id) and
    (p_partner_identity_card is null or p.identity_card = p_partner_identity_card);
end;
$$;

CREATE INDEX idx_partners_identity_card ON public.partners(identity_card);
CREATE INDEX idx_partners_status ON public.partners(status);
CREATE INDEX idx_partners_names_last_names ON public.partners(names, last_names);

CREATE INDEX idx_students_partner_id ON public.students(partner_id);
CREATE INDEX idx_students_identity_card ON public.students(identity_card);
CREATE INDEX idx_students_names_last_names ON public.students(names, last_names);

CREATE INDEX idx_user_profiles_partner_id ON public.user_profiles(partner_id);
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);

CREATE INDEX idx_temp_data_identity_card ON public.temp_data(identity_card);
CREATE INDEX idx_temp_data_names_last_names ON public.temp_data(names, last_names);

INSERT INTO public.temp_data (identity_card, names, last_names, dob, phone, email, address, education_level, occupation, marital_status, children) VALUES ('12345678', 'Juan Martín', 'Pérez Angar', '1985-05-20', '955001231', 'juan.perez@example.com', 'Calle Falsa 123', 'Universitario', 'Ingeniero', 'casado', '[{"relationship_type": "padre", "identity_card": "98765432", "names": "Carlos Sergio", "last_names": "Pérez Miranda", "dob": "2010-01-01", "school_grade": "5to grado", "health_info": "ninguno"}]');

INSERT INTO public.temp_data (identity_card, names, last_names, dob, phone, email, address, education_level, occupation, marital_status, children) VALUES ('23456789', 'Ana María', 'González López', '1990-03-15', '955005672', 'ana.gonzalez@example.com', 'Avenida Siempre Viva 456', 'Licenciatura', 'Diseñadora', 'soltera', '[{"relationship_type": "madre", "identity_card": "12345678", "names": "Sofía", "last_names": "González Pérez", "dob": "2015-04-10", "school_grade": "2do grado", "health_info": "alergia al polen"}]');

INSERT INTO public.temp_data (identity_card, names, last_names, dob, phone, email, address, education_level, occupation, marital_status, children) VALUES ('34567890', 'Pedro', 'Martínez Ramírez', '1978-11-25', '955008763', 'pedro.martinez@example.com', 'Calle Ejemplo 789', 'Secundaria', 'Electricista', 'divorciado', '[{"relationship_type": "padre", "identity_card": "65432109", "names": "Luis", "last_names": "Martínez González", "dob": "2012-08-05", "school_grade": "6to grado", "health_info": "asmático"}]');

INSERT INTO public.temp_data (identity_card, names, last_names, dob, phone, email, address, education_level, occupation, marital_status, children) VALUES ('45678901', 'Lucía', 'Torres Medina', '1982-07-30', '955004324', 'lucia.torres@example.com', 'Calle Real 101', 'Máster', 'Abogada', 'casada', '[{"relationship_type": "madre", "identity_card": "32165498", "names": "Valentina", "last_names": "Torres Pérez", "dob": "2018-12-12", "school_grade": "preescolar", "health_info": "ninguno"}]');
