-- Create churches table
create table public.churches (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    subdomain text not null unique,
    logo_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    -- Add constraint for subdomain format
    constraint subdomain_format check (subdomain ~* '^[a-z0-9-]+$')
);

-- Create profiles table
create table public.profiles (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users on delete cascade not null,
    church_id uuid references public.churches on delete cascade not null,
    role text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    -- Add constraint for role values
    constraint valid_role check (role in ('admin', 'editor', 'viewer')),
    
    -- Ensure unique user per church
    constraint unique_user_per_church unique (user_id, church_id)
);

-- Create sermons table
create table public.sermons (
    id uuid default gen_random_uuid() primary key,
    church_id uuid references public.churches on delete cascade not null,
    title text not null,
    description text,
    speaker text,
    series text,
    video_url text,
    date date not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.churches enable row level security;
alter table public.profiles enable row level security;
alter table public.sermons enable row level security;

-- Policies for churches
create policy "Churches are viewable by authenticated users"
    on public.churches for select
    using (true);

create policy "Churches are insertable by authenticated users"
    on public.churches for insert
    with check (true);

-- Policies for profiles
create policy "Profiles are viewable by users in the same church"
    on public.profiles for select
    using (
        auth.uid() in (
            select user_id from public.profiles
            where church_id = profiles.church_id
        )
    );

create policy "Profiles are insertable by authenticated users"
    on public.profiles for insert
    with check (auth.uid() = user_id);

-- Policies for sermons
create policy "Sermons are viewable by users in the same church"
    on public.sermons for select
    using (
        auth.uid() in (
            select user_id from public.profiles
            where church_id = sermons.church_id
        )
    );

create policy "Sermons are insertable by church admins and editors"
    on public.sermons for insert
    with check (
        auth.uid() in (
            select user_id from public.profiles
            where church_id = sermons.church_id
            and role in ('admin', 'editor')
        )
    );

-- Create indexes for better query performance
create index idx_profiles_user_id on public.profiles(user_id);
create index idx_profiles_church_id on public.profiles(church_id);
create index idx_sermons_church_id on public.sermons(church_id);
create index idx_churches_subdomain on public.churches(subdomain);