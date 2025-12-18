import Header from "@/components/Header";
import { BookOpen, Users, Shield, Scale, Globe, FileText, Calendar, BarChart3 } from "lucide-react";

const About = () => {
  const editorialBoard = [
    { name: "Prof. Egara Kabaji", role: "Editor-in-Chief", affiliation: "ACAIKC, Kenya", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face" },
    { name: "Prof. Akinwumi Ogundiran", role: "Associate Editor", affiliation: "University of North Carolina, USA", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face" },
    { name: "Dr. Fatima Bello", role: "Associate Editor", affiliation: "University of Lagos, Nigeria", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop&crop=face" },
    { name: "Dr. Wanjiku Mwangi", role: "Managing Editor", affiliation: "University of Nairobi, Kenya", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face" },
  ];

  const advisoryBoard = [
    { name: "Prof. Toyin Falola", affiliation: "University of Texas at Austin, USA", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face" },
    { name: "Prof. Sabelo Ndlovu-Gatsheni", affiliation: "University of Bayreuth, Germany", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face" },
    { name: "Prof. Nana Akua Anyidoho", affiliation: "University of Ghana", image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=200&h=200&fit=crop&crop=face" },
    { name: "Prof. Kwesi Yankah", affiliation: "Central University, Ghana", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <section className="py-8 md:py-12 border-b border-border animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">About the Journal</h1>
          <p className="text-lg text-muted-foreground">
            International Journal of Indigenous Knowledge and Cultural Studies (IJKCS)
          </p>
        </section>

        {/* About Section */}
        <section className="py-8 border-b border-border group">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-accent/20 group-hover:scale-110">
              <BookOpen className="w-5 h-5 text-primary transition-colors duration-300 group-hover:text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-3 transition-colors duration-300 group-hover:text-accent">About IJKCS</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The International Journal of Indigenous Knowledge and Cultural Studies (IJKCS) is a peer-reviewed scholarly journal published by the African Centre for Advancement of Indigenous Knowledge and Culture (ACAIKC). The journal provides a platform for rigorous academic discourse on African Indigenous Knowledge Systems and their relevance to contemporary society.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                IJKCS is committed to promoting interdisciplinary research that documents, analyzes, and advances understanding of indigenous knowledge systems across Africa and the diaspora.
              </p>
            </div>
          </div>
        </section>

        {/* Aims and Scope */}
        <section className="py-8 border-b border-border group">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-accent/20 group-hover:scale-110">
              <Globe className="w-5 h-5 text-primary transition-colors duration-300 group-hover:text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-3 transition-colors duration-300 group-hover:text-accent">Aims and Scope</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                IJKCS aims to advance scholarly understanding of African Indigenous Knowledge Systems through publication of high-quality research. The journal welcomes contributions in the following areas:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                {[
                  "Cultural values, practices, traditions, and worldviews",
                  "Language, literature, oral heritage, and storytelling traditions",
                  "Indigenous technologies, innovations, and craft traditions",
                  "Traditional governance, customary law, and conflict resolution",
                  "Environmental stewardship, agroecology, and land management",
                  "Traditional medicine, healing practices, and spirituality",
                  "Heritage preservation, museums, and knowledge transmission"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2 group/item">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0 transition-transform duration-300 group-hover/item:scale-150" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Editorial Board */}
        <section className="py-8 border-b border-border">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div className="w-full">
              <h2 className="text-xl font-semibold mb-6">Editorial Board</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {editorialBoard.map((member, index) => (
                  <div 
                    key={index} 
                    className="p-4 rounded-xl bg-card border border-border flex gap-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-accent/50 group cursor-default"
                  >
                    <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-border transition-all duration-300 group-hover:ring-accent">
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold transition-colors duration-300 group-hover:text-accent">{member.name}</h3>
                      <p className="text-sm text-accent">{member.role}</p>
                      <p className="text-sm text-muted-foreground">{member.affiliation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Advisory Board */}
        <section className="py-8 border-b border-border">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div className="w-full">
              <h2 className="text-xl font-semibold mb-6">Advisory Board</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {advisoryBoard.map((member, index) => (
                  <div 
                    key={index} 
                    className="p-4 rounded-xl bg-muted/50 flex gap-4 transition-all duration-300 hover:bg-accent/10 hover:scale-[1.02] group cursor-default"
                  >
                    <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-border transition-all duration-300 group-hover:ring-accent">
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium transition-colors duration-300 group-hover:text-accent">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.affiliation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Peer Review Process */}
        <section className="py-8 border-b border-border group">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-accent/20 group-hover:scale-110">
              <Shield className="w-5 h-5 text-primary transition-colors duration-300 group-hover:text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-3 transition-colors duration-300 group-hover:text-accent">Peer Review Process</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                IJKCS employs a rigorous double-blind peer review process. All submitted manuscripts are initially screened by the editorial team for scope and quality. Manuscripts that pass initial screening are sent to at least two independent reviewers with expertise in the relevant field.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The review process typically takes 8-12 weeks. Authors receive detailed feedback and are given the opportunity to revise their work based on reviewer comments. Final publication decisions are made by the Editor-in-Chief in consultation with the editorial board.
              </p>
            </div>
          </div>
        </section>

        {/* Open Access Policy */}
        <section className="py-8 border-b border-border group">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-accent/20 group-hover:scale-110">
              <Globe className="w-5 h-5 text-primary transition-colors duration-300 group-hover:text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-3 transition-colors duration-300 group-hover:text-accent">Open Access Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                IJKCS is an open access journal. All articles are freely available to readers immediately upon publication. We believe that open access promotes the widest possible dissemination of research and supports the mission of making indigenous knowledge accessible to communities worldwide.
              </p>
            </div>
          </div>
        </section>

        {/* Ethics and Plagiarism */}
        <section className="py-8 border-b border-border group">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-accent/20 group-hover:scale-110">
              <Shield className="w-5 h-5 text-primary transition-colors duration-300 group-hover:text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-3 transition-colors duration-300 group-hover:text-accent">Plagiarism and Ethics Policy</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                IJKCS adheres to the ethical guidelines established by the Committee on Publication Ethics (COPE). All submissions are screened for plagiarism using industry-standard software. We expect authors to ensure that their work is original and properly cites all sources.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Ethical considerations are particularly important when working with indigenous knowledge. Authors must demonstrate that their research respects community protocols, has appropriate permissions, and follows ethical guidelines for research involving human subjects and cultural heritage.
              </p>
            </div>
          </div>
        </section>

        {/* Copyright and Licensing */}
        <section className="py-8 border-b border-border group">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-accent/20 group-hover:scale-110">
              <Scale className="w-5 h-5 text-primary transition-colors duration-300 group-hover:text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-3 transition-colors duration-300 group-hover:text-accent">Copyright and Licensing</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Articles published in IJKCS are licensed under the Creative Commons Attribution 4.0 International License (CC BY 4.0). This license allows others to share, copy, distribute, and adapt the work, provided appropriate credit is given to the original author(s) and the source.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Authors retain copyright of their work while granting the journal the right of first publication. This approach supports the widest possible dissemination of research while protecting authors' rights.
              </p>
            </div>
          </div>
        </section>

        {/* Fees and Charges */}
        <section className="py-8 border-b border-border group">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-accent/20 group-hover:scale-110">
              <FileText className="w-5 h-5 text-primary transition-colors duration-300 group-hover:text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-3 transition-colors duration-300 group-hover:text-accent">Fees and Charges</h2>
              <p className="text-muted-foreground leading-relaxed">
                IJKCS does not charge article submission fees. Article Processing Charges (APCs) may apply for accepted manuscripts to cover publication costs. Fee waivers are available for authors from low-income countries and for researchers without institutional funding. Contact the editorial office for more information about fees and waiver eligibility.
              </p>
            </div>
          </div>
        </section>

        {/* Digital Preservation */}
        <section className="py-8 border-b border-border group">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-accent/20 group-hover:scale-110">
              <Shield className="w-5 h-5 text-primary transition-colors duration-300 group-hover:text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-3 transition-colors duration-300 group-hover:text-accent">Digital Preservation Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                IJKCS is committed to the long-term preservation of published content. All articles are archived in multiple formats and locations to ensure permanent accessibility. We work with digital preservation services to safeguard the scholarly record for future generations.
              </p>
            </div>
          </div>
        </section>

        {/* Publication Frequency */}
        <section className="py-8 border-b border-border group">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-accent/20 group-hover:scale-110">
              <Calendar className="w-5 h-5 text-primary transition-colors duration-300 group-hover:text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-3 transition-colors duration-300 group-hover:text-accent">Publication Frequency</h2>
              <p className="text-muted-foreground leading-relaxed">
                IJKCS publishes one volume per year, with articles released on a rolling basis as they are accepted and prepared for publication. Special issues on focused themes may be published periodically.
              </p>
            </div>
          </div>
        </section>

        {/* Usage and Impact */}
        <section className="py-8 group">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-accent/20 group-hover:scale-110">
              <BarChart3 className="w-5 h-5 text-primary transition-colors duration-300 group-hover:text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-3 transition-colors duration-300 group-hover:text-accent">Usage and Impact</h2>
              <p className="text-muted-foreground leading-relaxed">
                IJKCS tracks article downloads, citations, and other metrics to assess the reach and impact of published research. The journal is working toward indexing in major academic databases and is committed to meeting international standards for scholarly publishing.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2025 International Journal of Indigenous Knowledge and Cultural Studies (IJKCS). All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
