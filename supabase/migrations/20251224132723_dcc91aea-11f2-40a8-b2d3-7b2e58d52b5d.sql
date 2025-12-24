-- Create journal_articles table
CREATE TABLE public.journal_articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  authors TEXT[] NOT NULL,
  abstract TEXT NOT NULL,
  keywords TEXT[] NOT NULL,
  volume INTEGER NOT NULL,
  issue INTEGER,
  year INTEGER NOT NULL,
  pages TEXT NOT NULL,
  doi TEXT,
  pdf_url TEXT,
  published_date TEXT NOT NULL,
  topic TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.journal_articles ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (journal articles should be publicly accessible)
CREATE POLICY "Anyone can view journal articles" 
ON public.journal_articles 
FOR SELECT 
USING (true);

-- Create storage bucket for PDFs
INSERT INTO storage.buckets (id, name, public) 
VALUES ('journal-pdfs', 'journal-pdfs', true);

-- Create policy for public PDF access
CREATE POLICY "Anyone can view PDFs" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'journal-pdfs');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_journal_articles_updated_at
BEFORE UPDATE ON public.journal_articles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better search performance
CREATE INDEX idx_journal_articles_year ON public.journal_articles(year);
CREATE INDEX idx_journal_articles_volume ON public.journal_articles(volume);
CREATE INDEX idx_journal_articles_topic ON public.journal_articles(topic);
CREATE INDEX idx_journal_articles_title ON public.journal_articles USING gin(to_tsvector('english', title));
CREATE INDEX idx_journal_articles_abstract ON public.journal_articles USING gin(to_tsvector('english', abstract));