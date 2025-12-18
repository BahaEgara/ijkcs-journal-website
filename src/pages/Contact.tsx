import Header from "@/components/Header";
import { Mail, MapPin, User, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    affiliation: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
    setFormData({ name: "", email: "", affiliation: "", subject: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <section className="py-8 md:py-12 border-b border-border">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Contact</h1>
          <p className="text-lg text-muted-foreground">
            Get in touch with the International Journal of Indigenous Knowledge and Cultural Studies
          </p>
        </section>

        <div className="py-8 md:py-12 grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Postal Address</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      International Journal of Indigenous Knowledge and Cultural Studies (IJKCS)<br />
                      African Centre for Advancement of Indigenous Knowledge and Culture<br />
                      P.O. Box 72-00618<br />
                      Nairobi, Kenya
                    </p>
                  </div>
                </div>

                {/* General Inquiries */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">General Inquiries</h3>
                    <a 
                      href="mailto:info.ijikcs@gmail.com" 
                      className="text-accent hover:underline text-sm"
                    >
                      info.ijikcs@gmail.com
                    </a>
                  </div>
                </div>

                {/* Editor-in-Chief */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Editor-in-Chief</h3>
                    <p className="text-muted-foreground text-sm mb-1">Prof. Egara Kabaji</p>
                    <a 
                      href="mailto:info.ijikcs@gmail.com" 
                      className="text-accent hover:underline text-sm"
                    >
                      info.ijikcs@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="p-6 rounded-xl bg-card border border-border">
              <h3 className="font-semibold mb-3">Submission Inquiries</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                For questions about manuscript submission, peer review status, or publication guidelines, please contact the editorial office at{" "}
                <a href="mailto:info.ijikcs@gmail.com" className="text-accent hover:underline">
                  info.ijikcs@gmail.com
                </a>
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-xl font-semibold mb-6">Send a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="affiliation" className="block text-sm font-medium mb-2">
                  Institution/Affiliation
                </label>
                <input
                  type="text"
                  id="affiliation"
                  name="affiliation"
                  value={formData.affiliation}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  placeholder="Your university or organization"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                >
                  <option value="">Select a subject</option>
                  <option value="submission">Manuscript Submission</option>
                  <option value="review">Review Status</option>
                  <option value="subscription">Subscription/Access</option>
                  <option value="partnership">Partnership/Collaboration</option>
                  <option value="other">Other Inquiry</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-none"
                  placeholder="Your message..."
                />
              </div>

              <Button type="submit" className="w-full gap-2">
                <Send className="w-4 h-4" />
                Send Message
              </Button>
            </form>
          </div>
        </div>
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

export default Contact;
