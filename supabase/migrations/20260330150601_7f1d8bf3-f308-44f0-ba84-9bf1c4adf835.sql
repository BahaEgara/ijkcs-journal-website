
-- Create journal_settings table for storing journal configuration
CREATE TABLE public.journal_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value text NOT NULL,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.journal_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings (public journal info)
CREATE POLICY "Anyone can view journal settings"
  ON public.journal_settings FOR SELECT TO public
  USING (true);

-- Only admins can modify settings
CREATE POLICY "Admins can insert settings"
  ON public.journal_settings FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update settings"
  ON public.journal_settings FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete settings"
  ON public.journal_settings FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Insert default settings
INSERT INTO public.journal_settings (setting_key, setting_value) VALUES
  ('journal_name', 'International Journal of Indigenous Knowledge and Cultural Studies'),
  ('abbreviation', 'IJIKCS'),
  ('issn_print', 'XXXX-XXXX'),
  ('issn_online', 'XXXX-XXXX'),
  ('description', 'A peer-reviewed, open-access journal dedicated to the study, preservation, and dissemination of indigenous knowledge systems and cultural heritage across Africa and the Global South.'),
  ('open_access', 'true'),
  ('email_notifications', 'true'),
  ('show_downloads_count', 'false');

-- Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to view all user roles
CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
