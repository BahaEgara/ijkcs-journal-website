import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface JournalArticle {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  keywords: string[];
  volume: number;
  issue?: number | null;
  year: number;
  pages: string;
  doi?: string | null;
  pdf_url?: string | null;
  published_date: string;
  topic?: string | null;
  created_at: string;
  updated_at: string;
}

export interface SearchFilters {
  searchQuery?: string;
  year?: number | null;
  volume?: number | null;
  topic?: string | null;
  author?: string | null;
  keyword?: string | null;
}

export const useJournalArticles = (filters?: SearchFilters) => {
  return useQuery({
    queryKey: ["journal-articles", filters],
    queryFn: async () => {
      let query = supabase
        .from("journal_articles")
        .select("*")
        .order("volume", { ascending: false })
        .order("pages", { ascending: true });

      if (filters?.year) {
        query = query.eq("year", filters.year);
      }

      if (filters?.volume) {
        query = query.eq("volume", filters.volume);
      }

      if (filters?.topic) {
        query = query.eq("topic", filters.topic);
      }

      if (filters?.searchQuery) {
        const searchTerm = `%${filters.searchQuery}%`;
        query = query.or(
          `title.ilike.${searchTerm},abstract.ilike.${searchTerm}`
        );
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching journal articles:", error);
        throw error;
      }

      // Filter by author if specified (need to do client-side for array contains)
      let filteredData = data || [];
      
      if (filters?.author) {
        const authorLower = filters.author.toLowerCase();
        filteredData = filteredData.filter((article) =>
          article.authors.some((a: string) => a.toLowerCase().includes(authorLower))
        );
      }

      if (filters?.keyword) {
        const keywordLower = filters.keyword.toLowerCase();
        filteredData = filteredData.filter((article) =>
          article.keywords.some((k: string) => k.toLowerCase().includes(keywordLower))
        );
      }

      return filteredData as JournalArticle[];
    },
  });
};

export const useJournalArticle = (id: string) => {
  return useQuery({
    queryKey: ["journal-article", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("journal_articles")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching journal article:", error);
        throw error;
      }

      return data as JournalArticle | null;
    },
    enabled: !!id,
  });
};

export const useAvailableYears = () => {
  return useQuery({
    queryKey: ["journal-years"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("journal_articles")
        .select("year")
        .order("year", { ascending: false });

      if (error) {
        console.error("Error fetching years:", error);
        throw error;
      }

      const uniqueYears = [...new Set(data?.map((d) => d.year) || [])];
      return uniqueYears;
    },
  });
};

export const useAvailableTopics = () => {
  return useQuery({
    queryKey: ["journal-topics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("journal_articles")
        .select("topic")
        .not("topic", "is", null);

      if (error) {
        console.error("Error fetching topics:", error);
        throw error;
      }

      const uniqueTopics = [...new Set(data?.map((d) => d.topic).filter(Boolean) || [])];
      return uniqueTopics as string[];
    },
  });
};

export const useAvailableVolumes = () => {
  return useQuery({
    queryKey: ["journal-volumes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("journal_articles")
        .select("volume")
        .order("volume", { ascending: false });

      if (error) {
        console.error("Error fetching volumes:", error);
        throw error;
      }

      const uniqueVolumes = [...new Set(data?.map((d) => d.volume) || [])];
      return uniqueVolumes;
    },
  });
};
