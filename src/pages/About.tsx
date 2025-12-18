import Header from "@/components/Header";
import { BookOpen, Users, Shield, Scale, Globe, FileText, Calendar, BarChart3 } from "lucide-react";

const About = () => {
  const editorialBoard = [
    { name: "Prof. Egara Kabaji", role: "Editor-in-Chief", affiliation: "ACAIKC, Kenya" },
    { name: "Prof. Akinwumi Ogundiran", role: "Associate Editor", affiliation: "University of North Carolina, USA" },
    { name: "Dr. Fatima Bello", role: "Associate Editor", affiliation: "University of Lagos, Nigeria" },
    { name: "Dr. Wanjiku Mwangi", role: "Managing Editor", affiliation: "University of Nairobi, Kenya" },
  ];

  const advisoryBoard = [
    { name: "Prof. Toyin Falola", affiliation: "University of Texas at Austin, USA" },
    { name: "Prof. Sabelo Ndlovu-Gatsheni", affiliation: "University of Bayreuth, Germany" },
    { name: "Prof. Nana Akua Anyidoho", affiliation: "University of Ghana" },
    { name: "Prof. Kwesi Yankah", affiliation: "Central University, Ghana" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <section className="py-8 md:py-12 border-b border-border">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">About the Journal</h1>
          <p className="text-lg text-muted-foreground">
            International Journal of Indigenous Knowledge and Cultural Studies (IJKCS)
          </p>
        </section>

        {/* About Section */}
        <section className="py-8 border-b border-border">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-3">About IJKCS</h2>
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
        <section className="py-8 border-b border-border">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-3">Aims and Scope</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                IJKCS aims to advance scholarly understanding of African Indigenous Knowledge Systems through publication of high-quality research. The journal welcomes contributions in the following areas:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                  Cultural values, practices, traditions, and worldviews
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                  Language, literature, oral heritage, and storytelling traditions
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                  Indigenous technologies, innovations, and craft traditions
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                  Traditional governance, customary law, and conflict resolution
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                  Environmental stewardship, agroecology, and land management
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                  Traditional medicine, healing practices, and spirituality
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                  Heritage preservation, museums, and knowledge transmission
                </li>
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
              <h2 className="text-xl font-semibold mb-4">Editorial Board</h2>
              <div className="grid gap-4">
                {editorialBoard.map((member, index) => (
                  <div key={index} className="p-4 rounded-lg bg-card border border-border">
                    <h3 className="font-semibold">{member.name}</h3>
                    <p className="text-sm text-accent">{member.role}</p>
                    <p className="text-sm text-muted-foreground">{member.affiliation}</p>
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
              <h2 className="text-xl font-semibold mb-4">Advisory Board</h2>
              <div className="grid gap-3">
                {advisoryBoard.map((member, index) => (
                  <div key={index} className="p-3 rounded-lg bg-muted/50">
                    <h3 className="font-medium">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.affiliation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Peer Review Process */}
        <section className="py-8 border-b border-border">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-3">Peer Review Process</h2>
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
        <section className="py-8 border-b border-border">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-3">Open Access Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                IJKCS is an open access journal. All articles are freely available to readers immediately upon publication. We believe that open access promotes the widest possible dissemination of research and supports the mission of making indigenous knowledge accessible to communities worldwide.
              </p>
            </div>
          </div>
        </section>

        {/* Ethics and Plagiarism */}
        <section className="py-8 border-b border-border">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-3">Plagiarism and Ethics Policy</h2>
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
        <section className="py-8 border-b border-border">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Scale className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-3">Copyright and Licensing</h2>
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
        <section className="py-8 border-b border-border">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-3">Fees and Charges</h2>
              <p className="text-muted-foreground leading-relaxed">
                IJKCS does not charge article submission fees. Article Processing Charges (APCs) may apply for accepted manuscripts to cover publication costs. Fee waivers are available for authors from low-income countries and for researchers without institutional funding. Contact the editorial office for more information about fees and waiver eligibility.
              </p>
            </div>
          </div>
        </section>

        {/* Digital Preservation */}
        <section className="py-8 border-b border-border">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-3">Digital Preservation Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                IJKCS is committed to the long-term preservation of published content. All articles are archived in multiple formats and locations to ensure permanent accessibility. We work with digital preservation services to safeguard the scholarly record for future generations.
              </p>
            </div>
          </div>
        </section>

        {/* Publication Frequency */}
        <section className="py-8 border-b border-border">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-3">Publication Frequency</h2>
              <p className="text-muted-foreground leading-relaxed">
                IJKCS publishes one volume per year, with articles released on a rolling basis as they are accepted and prepared for publication. Special issues on focused themes may be published periodically.
              </p>
            </div>
          </div>
        </section>

        {/* Usage and Impact */}
        <section className="py-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-3">Usage and Impact</h2>
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
