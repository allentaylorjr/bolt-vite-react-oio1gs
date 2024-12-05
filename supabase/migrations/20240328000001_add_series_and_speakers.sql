-- Create series table
create table public.series (
    id uuid default gen_random_uuid() primary key,
    church_id uuid references public.churches on delete cascade not null,
    name text not null,
    description text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    -- Ensure unique series names within a church
    constraint unique_series_name_per_church unique (church_id, name)
);

-- Create speakers table
create table public.speakers (
    id uuid default gen_random_uuid() primary key,
    church_id uuid references public.churches on delete cascade not null,
    name text not null,
    title text,
    bio text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    -- Ensure unique speaker names within a church
    constraint unique_speaker_name_per_church unique (church_id, name)
);

-- Add indexes
create index idx_series_church_id on public.series(church_id);
create index idx_speakers_church_id on public.speakers(church_id);

-- Set up RLS policies for series
alter table public.series enable row level security;

create policy "Series are viewable by users in the same church"
    on public.series for select
    using (
        auth.uid() in (
            select user_id from public.profiles
            where church_id = series.church_id
        )
    );

create policy "Series are insertable by church admins and editors"
    on public.series for insert
    with check (
        auth.uid() in (
            select user_id from public.profiles
            where church_id = series.church_id
            and role in ('admin', 'editor')
        )
    );

-- Set up RLS policies for speakers
alter table public.speakers enable row level security;

create policy "Speakers are viewable by users in the same church"
    on public.speakers for select
    using (
        auth.uid() in (
            select user_id from public.profiles
            where church_id = speakers.church_id
        )
    );

create policy "Speakers are insertable by church admins and editors"
    on public.speakers for insert
    with check (
        auth.uid() in (
            select user_id from public.profiles
            where church_id = speakers.church_id
            and role in ('admin', 'editor')
        )
    );