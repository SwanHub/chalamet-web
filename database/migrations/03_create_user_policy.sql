CREATE POLICY "Anyone can create a user" 
ON "users" 
FOR INSERT 
WITH CHECK (true);