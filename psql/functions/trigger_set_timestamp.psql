/* Used in tables in combination with triggers to create timestamps 
Reference: https://x-team.com/blog/automatic-timestamps-with-postgresql
*/
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;