export interface JournalArticle {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  keywords: string[];
  volume: number;
  issue?: number;
  year: number;
  pages: string;
  doi?: string;
  pdfUrl: string;
  publishedDate: string;
}

export interface JournalIssue {
  volume: number;
  issue?: number;
  year: number;
  publishedDate: string;
  articles: JournalArticle[];
}

// Current Issue - Volume 1 (2026)
export const currentIssue: JournalIssue = {
  volume: 1,
  year: 2026,
  publishedDate: "February 2026",
  articles: [
    {
      id: "ijkcs-2026-001",
      title: "Preserving African Indigenous Knowledge Systems: A Framework for Documentation and Transmission",
      authors: ["Akinwumi Ogundiran", "Fatima Bello"],
      abstract: "This paper proposes a comprehensive framework for documenting and transmitting African Indigenous Knowledge Systems (IKS) to future generations. Drawing on case studies from Nigeria and Kenya, we examine traditional methods of knowledge preservation and propose modern adaptations that respect cultural protocols while ensuring accessibility.",
      keywords: ["indigenous knowledge", "documentation", "knowledge transmission", "cultural preservation"],
      volume: 1,
      year: 2026,
      pages: "1-24",
      pdfUrl: "#",
      publishedDate: "February 2026"
    },
    {
      id: "ijkcs-2026-002",
      title: "Traditional Conflict Resolution Mechanisms in East African Communities: Lessons for Contemporary Governance",
      authors: ["Wanjiku Mwangi", "Samuel Ochieng"],
      abstract: "This study examines traditional conflict resolution mechanisms practiced across East African communities, analyzing their effectiveness and relevance to contemporary governance structures. Through ethnographic research in Kenya, Uganda, and Tanzania, we identify key principles that could enhance modern dispute resolution frameworks.",
      keywords: ["conflict resolution", "traditional governance", "East Africa", "customary law"],
      volume: 1,
      year: 2026,
      pages: "25-48",
      pdfUrl: "#",
      publishedDate: "February 2026"
    },
    {
      id: "ijkcs-2026-003",
      title: "Indigenous Agroecological Practices and Climate Resilience in Sub-Saharan Africa",
      authors: ["Chioma Nwosu", "Kofi Asante", "Amara Diallo"],
      abstract: "This research investigates indigenous agroecological practices in Sub-Saharan Africa and their potential contribution to climate resilience. We document traditional farming systems, seed preservation methods, and land management techniques that have sustained communities for generations and assess their applicability in the context of climate change adaptation.",
      keywords: ["agroecology", "climate resilience", "traditional farming", "sustainability"],
      volume: 1,
      year: 2026,
      pages: "49-76",
      pdfUrl: "#",
      publishedDate: "February 2026"
    },
    {
      id: "ijkcs-2026-004",
      title: "Oral Literature as Cultural Repository: A Study of Proverbs and Riddles in Swahili-Speaking Communities",
      authors: ["Bakari Musa"],
      abstract: "This paper explores the role of proverbs and riddles as repositories of cultural knowledge in Swahili-speaking communities. Through analysis of collected oral literature from coastal Kenya and Tanzania, we demonstrate how these linguistic forms encode philosophical concepts, moral teachings, and historical memory.",
      keywords: ["oral literature", "Swahili culture", "proverbs", "cultural heritage"],
      volume: 1,
      year: 2026,
      pages: "77-98",
      pdfUrl: "#",
      publishedDate: "February 2026"
    },
    {
      id: "ijkcs-2026-005",
      title: "Traditional African Medicine: Integrating Indigenous Healing Knowledge with Modern Healthcare Systems",
      authors: ["Esther Ndung'u", "Peter Mutiso"],
      abstract: "This study examines approaches to integrating traditional African medicine with modern healthcare delivery systems. Through case studies of collaborative models in Kenya and South Africa, we analyze challenges, successes, and policy frameworks that can facilitate respectful integration while protecting indigenous intellectual property.",
      keywords: ["traditional medicine", "healthcare integration", "indigenous healing", "health policy"],
      volume: 1,
      year: 2026,
      pages: "99-124",
      pdfUrl: "#",
      publishedDate: "February 2026"
    },
    {
      id: "ijkcs-2026-006",
      title: "Sacred Spaces and Environmental Conservation: Indigenous Approaches to Biodiversity Protection in Kenya",
      authors: ["Grace Wambui", "John Kamau", "Mary Njeri"],
      abstract: "This research explores the relationship between sacred natural sites and biodiversity conservation in Kenya. We document how traditional beliefs and practices associated with sacred groves, forests, and water sources have contributed to environmental protection and discuss implications for contemporary conservation policy.",
      keywords: ["sacred spaces", "environmental conservation", "biodiversity", "traditional beliefs"],
      volume: 1,
      year: 2026,
      pages: "125-152",
      pdfUrl: "#",
      publishedDate: "February 2026"
    }
  ]
};

// Archives - Past Issues (empty for now as this is Volume 1)
export const archiveIssues: JournalIssue[] = [];

// All issues including current
export const allIssues: JournalIssue[] = [currentIssue, ...archiveIssues];
