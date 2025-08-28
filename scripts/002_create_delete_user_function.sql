-- Create function to delete user account
create or replace function delete_user()
returns void
language plpgsql
security definer
as $$
declare
  user_id uuid;
begin
  -- Get the current user's ID
  user_id := auth.uid();
  
  if user_id is null then
    raise exception 'Not authenticated';
  end if;
  
  -- Delete user profile (will cascade to other related data)
  delete from public.profiles where id = user_id;
  
  -- Delete the auth user (this will cascade to all related data)
  delete from auth.users where id = user_id;
end;
$$;
