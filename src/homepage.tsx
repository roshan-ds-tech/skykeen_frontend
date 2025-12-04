import React, { useState } from 'react';
import { ImageGallery } from '@/components/ui/carousel-circular-image-gallery';
import { Menu, X } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.skykeenentreprise.com';

const Homepage: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    studentName: '',
    studentClass: '',
    schoolName: '',
    studentContact: '',
    studentEmail: '',
    sibling1Name: '',
    sibling1School: '',
    sibling1Class: '',
    sibling2Name: '',
    sibling2School: '',
    sibling2Class: '',
    parentName: '',
    parentContact: '',
    parentSignature: '',
    competitions: [] as string[],
    workshops: [] as string[],
    paymentMode: '',
    transactionId: '',
  });
  
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [paymentScreenshotPreview, setPaymentScreenshotPreview] = useState<string | null>(null);
  const [parentSignatureFile, setParentSignatureFile] = useState<File | null>(null);
  const [parentSignaturePreview, setParentSignaturePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    closeMobileMenu();
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const type = (e.target as HTMLInputElement).type;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (type === 'checkbox') {
      const fieldName = name as 'competitions' | 'workshops';
      if (checked) {
        setFormData(prev => ({
          ...prev,
          [fieldName]: [...prev[fieldName], value]
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [fieldName]: prev[fieldName].filter(item => item !== value)
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle payment screenshot upload
  const handlePaymentScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setSubmitMessage({ type: 'error', text: 'Payment screenshot must be less than 10MB' });
        return;
      }
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setSubmitMessage({ type: 'error', text: 'Only JPG, PNG, and WEBP formats are allowed' });
        return;
      }
      setPaymentScreenshot(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle parent signature upload (if it's a file input)
  const handleParentSignatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setSubmitMessage({ type: 'error', text: 'Parent signature must be less than 10MB' });
        return;
      }
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setSubmitMessage({ type: 'error', text: 'Only JPG, PNG, and WEBP formats are allowed' });
        return;
      }
      setParentSignatureFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setParentSignaturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      // Student details
      formDataToSend.append('student_name', formData.studentName);
      formDataToSend.append('student_class', formData.studentClass);
      formDataToSend.append('school_name', formData.schoolName);
      formDataToSend.append('student_contact', formData.studentContact);
      formDataToSend.append('student_email', formData.studentEmail);
      
      // Sibling details
      if (formData.sibling1Name) formDataToSend.append('sibling1_name', formData.sibling1Name);
      if (formData.sibling1School) formDataToSend.append('sibling1_school', formData.sibling1School);
      if (formData.sibling1Class) formDataToSend.append('sibling1_class', formData.sibling1Class);
      if (formData.sibling2Name) formDataToSend.append('sibling2_name', formData.sibling2Name);
      if (formData.sibling2School) formDataToSend.append('sibling2_school', formData.sibling2School);
      if (formData.sibling2Class) formDataToSend.append('sibling2_class', formData.sibling2Class);
      
      // Parent details
      formDataToSend.append('parent_name', formData.parentName);
      formDataToSend.append('parent_contact', formData.parentContact);
      if (parentSignatureFile) {
        formDataToSend.append('parent_signature', parentSignatureFile);
      } else if (formData.parentSignature) {
        // If it's a text signature, we might need to handle it differently
        // For now, we'll skip it if no file is provided
      }
      
      // Competitions and workshops (as JSON arrays)
      const competitionsJson = JSON.stringify(formData.competitions);
      const workshopsJson = JSON.stringify(formData.workshops);
      console.log('Sending competitions:', competitionsJson, 'type:', typeof competitionsJson);
      console.log('Sending workshops:', workshopsJson, 'type:', typeof workshopsJson);
      
      formDataToSend.append('competitions', competitionsJson);
      formDataToSend.append('workshops', workshopsJson);
      
      // Payment details
      formDataToSend.append('payment_mode', formData.paymentMode || 'Online');
      formDataToSend.append('transaction_id', formData.transactionId);
      
      if (!paymentScreenshot) {
        setSubmitMessage({ type: 'error', text: 'Please upload a payment screenshot' });
        setIsSubmitting(false);
        return;
      }
      formDataToSend.append('payment_screenshot', paymentScreenshot);

      // Log all FormData entries for debugging
      console.log('FormData entries:');
      for (const [key, value] of formDataToSend.entries()) {
        if (value instanceof File) {
          console.log(`${key}: [File] ${value.name}, size: ${value.size}`);
        } else {
          console.log(`${key}: ${value} (type: ${typeof value})`);
        }
      }

      // Submit to API
      console.log('Submitting to:', `${API_BASE_URL}/api/registrations/`);
      console.log('Current origin:', window.location.origin);
      console.log('API Base URL:', API_BASE_URL);
      
      let response;
      try {
        response = await fetch(`${API_BASE_URL}/api/registrations/`, {
          method: 'POST',
          mode: 'cors',
          credentials: 'omit',
          body: formDataToSend,
        });
      } catch (fetchError: any) {
        console.error('Fetch error:', fetchError);
        // Handle network errors
        if (fetchError.message === 'Failed to fetch' || fetchError.name === 'TypeError') {
          throw new Error('Unable to connect to the server. Please check your internet connection and ensure the API server is running. If the problem persists, the server may be experiencing issues.');
        }
        throw new Error(fetchError.message || 'Network error occurred. Please try again.');
      }

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          // If response is not JSON, use status text
          throw new Error(`Server error: ${response.status} ${response.statusText || 'Unknown error'}`);
        }
        
        console.error('Backend error response:', errorData);
        
        // Handle Django REST Framework validation errors
        if (errorData.detail) {
          throw new Error(errorData.detail);
        } else if (errorData.error) {
          throw new Error(errorData.error);
        } else if (typeof errorData === 'object') {
          // Collect all validation errors
          const errors = [];
          for (const [field, messages] of Object.entries(errorData)) {
            if (Array.isArray(messages)) {
              errors.push(`${field}: ${messages.join(', ')}`);
            } else if (typeof messages === 'string') {
              errors.push(`${field}: ${messages}`);
            } else if (Array.isArray(messages) && messages.length > 0) {
              errors.push(`${field}: ${messages[0]}`);
            }
          }
          throw new Error(errors.length > 0 ? errors.join('; ') : 'Registration failed. Please check all fields.');
        } else {
          throw new Error(`Registration failed (${response.status}). Please try again.`);
        }
      }

      await response.json();
      setSubmitMessage({ type: 'success', text: 'Registration submitted successfully! We will contact you soon.' });
      
      // Scroll to success message after a brief delay to ensure it's rendered
      setTimeout(() => {
        const successElement = document.getElementById('registration-success-message');
        if (successElement) {
          successElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      
      // Reset form
      setFormData({
        studentName: '',
        studentClass: '',
        schoolName: '',
        studentContact: '',
        studentEmail: '',
        sibling1Name: '',
        sibling1School: '',
        sibling1Class: '',
        sibling2Name: '',
        sibling2School: '',
        sibling2Class: '',
        parentName: '',
        parentContact: '',
        parentSignature: '',
        competitions: [],
        workshops: [],
        paymentMode: '',
        transactionId: '',
      });
      setPaymentScreenshot(null);
      setPaymentScreenshotPreview(null);
      setParentSignatureFile(null);
      setParentSignaturePreview(null);
      
      // Reset file inputs
      const fileInputs = document.querySelectorAll('input[type="file"]');
      fileInputs.forEach(input => (input as HTMLInputElement).value = '');
      
    } catch (error: any) {
      console.error('Registration error:', error);
      setSubmitMessage({ type: 'error', text: error.message || 'Failed to submit registration. Please try again.' });
      
      // Scroll to error message after a brief delay to ensure it's rendered
      setTimeout(() => {
        const errorElement = document.getElementById('registration-error-message');
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
      {/* Full-width header */}
      <header className="w-full flex items-center justify-between whitespace-nowrap border-b border-solid border-white/20 dark:border-b-[#493f22] px-4 md:px-8 lg:px-16 xl:px-24 py-4 sticky top-0 bg-background-dark/80 backdrop-blur-sm z-50">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 text-white">
            <img
              src="/logo2.png"
              alt="Skykeen logo"
              className="h-14 w-auto md:h-16 object-contain" style={{marginTop: -10, marginBottom: -10, padding: 0}}
            />
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
              <a className="text-white text-sm font-medium leading-normal hover:text-primary transition-colors cursor-pointer" href="#hero" onClick={(e) => { e.preventDefault(); document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' }); }}>Home</a>
              <a className="text-white text-sm font-medium leading-normal hover:text-primary transition-colors cursor-pointer" href="#expertise" onClick={(e) => { e.preventDefault(); document.getElementById('expertise')?.scrollIntoView({ behavior: 'smooth' }); }}>About Us</a>
              <a className="text-white text-sm font-medium leading-normal hover:text-primary transition-colors cursor-pointer" href="#services" onClick={(e) => { e.preventDefault(); document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }); }}>Services</a>
              <a className="text-white text-sm font-medium leading-normal hover:text-primary transition-colors cursor-pointer" href="#gallery" onClick={(e) => { e.preventDefault(); document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' }); }}>Gallery</a>
            </div>
            <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-background-dark text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors" onClick={(e) => { e.preventDefault(); document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' }); }}>
              <span className="truncate">Book Your Event</span>
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 text-white hover:text-primary transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-background-dark/95 backdrop-blur-sm border-b border-solid border-white/20 dark:border-b-[#493f22] shadow-lg">
            <div className="flex flex-col px-4 py-4 space-y-4">
              <a
                className="text-white text-base font-medium leading-normal hover:text-primary transition-colors cursor-pointer py-2"
                href="#hero"
                onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}
              >
                Home
              </a>
              <a
                className="text-white text-base font-medium leading-normal hover:text-primary transition-colors cursor-pointer py-2"
                href="#expertise"
                onClick={(e) => { e.preventDefault(); scrollToSection('expertise'); }}
              >
                About Us
              </a>
              <a
                className="text-white text-base font-medium leading-normal hover:text-primary transition-colors cursor-pointer py-2"
                href="#services"
                onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}
              >
                Services
              </a>
              <a
                className="text-white text-base font-medium leading-normal hover:text-primary transition-colors cursor-pointer py-2"
                href="#gallery"
                onClick={(e) => { e.preventDefault(); scrollToSection('gallery'); }}
              >
                Gallery
              </a>
              <button
                className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-background-dark text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors mt-2"
                onClick={(e) => { e.preventDefault(); scrollToSection('register'); }}
              >
                Book Your Event
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Full-width hero section */}
      <div id="hero" className="w-full scroll-mt-20">
        <div 
          className="w-full flex min-h-[600px] md:min-h-[700px] flex-col gap-6 bg-cover bg-center bg-no-repeat items-center justify-center p-8 md:p-12" 
          style={{
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.6) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCUbVweiuyJQPsI6QT5yoTqQL-HK7J0zqSGf0hYi9KaS3c9bOTT9PUAMEDU2TxKEsZQhPNw5TuYRzVR1YCX6edORKY1rh3sREmy-ZtBzBeWSLqfi3qdAW5eRAVc0csS0ygv1w6jDmixjDjPbZ9jURNcTS37d4P2uS99YzULU9W5AZjX5EsoDyASCXk28SqgPh_67lHmivWRzM8lntoulrN2QV8bPS7VnXxL2ZXHGnGyT62qbtpT0n7cGa8Qnp21g8n8FD0oyKV_AYRs")'
          }}
        >
          <div className="flex flex-col gap-4 text-center max-w-4xl mx-auto">
            <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-[-0.033em]">Skykeen - Crafting Timeless Experiences</h1>
            <h2 className="text-white/90 text-base md:text-lg font-normal leading-normal max-w-2xl mx-auto">An elegant and luxurious event organizing service dedicated to creating unforgettable moments.</h2>
          </div>
          <div className="flex flex-wrap gap-4 justify-center mt-6">
            <button className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 md:px-8 bg-primary text-background-dark text-base md:text-lg font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-all transform hover:scale-105 shadow-lg" onClick={(e) => { e.preventDefault(); document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' }); }}>
              <span className="truncate">Register Now</span>
            </button>
            <button className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 md:px-8 bg-white/20 dark:bg-[#493f22] text-white text-base md:text-lg font-bold leading-normal tracking-[0.015em] hover:bg-white/30 dark:hover:bg-[#5a4d2a] transition-all transform hover:scale-105 border border-white/20" onClick={(e) => { e.preventDefault(); document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }); }}>
              <span className="truncate">Explore Our Work</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content sections with max-width for readability */}
      <div className="w-full">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-16 xl:px-24 py-12 md:py-16">
            <div id="expertise" className="mt-16 scroll-mt-24">
              <h2 className="text-white text-3xl md:text-4xl font-bold leading-tight tracking-[-0.015em] pb-8 pt-5 text-center">Our Expertise</h2>
              <div className="flex flex-wrap justify-center gap-6">
                <div className="flex gap-4 rounded-xl border border-[#685a31]/50 bg-[#342d18]/50 p-6 flex-col text-center items-center hover:bg-[#342d18]/70 hover:border-primary/50 transition-all transform hover:scale-105 cursor-pointer w-full sm:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)] xl:flex-[0_0_calc(25%-18px)]">
                  <span className="material-symbols-outlined text-primary text-4xl">business_center</span>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-white text-lg font-bold leading-tight">Corporate Galas</h3>
                    <p className="text-[#cbbc90] text-sm font-normal leading-normal">Executing flawless corporate events that reflect your brand's prestige.</p>
                  </div>
                </div>
                <div className="flex gap-4 rounded-xl border border-[#685a31]/50 bg-[#342d18]/50 p-6 flex-col text-center items-center hover:bg-[#342d18]/70 hover:border-primary/50 transition-all transform hover:scale-105 cursor-pointer w-full sm:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)] xl:flex-[0_0_calc(25%-18px)]">
                  <span className="material-symbols-outlined text-primary text-4xl">event</span>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-white text-lg font-bold leading-tight">Expos</h3>
                    <p className="text-[#cbbc90] text-sm font-normal leading-normal">Curating large-scale expos that connect brands, innovators, and audiences.</p>
                  </div>
                </div>
                <div className="flex gap-4 rounded-xl border border-[#685a31]/50 bg-[#342d18]/50 p-6 flex-col text-center items-center hover:bg-[#342d18]/70 hover:border-primary/50 transition-all transform hover:scale-105 cursor-pointer w-full sm:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)] xl:flex-[0_0_calc(25%-18px)]">
                  <span className="material-symbols-outlined text-primary text-4xl">celebration</span>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-white text-lg font-bold leading-tight">Bespoke Celebrations</h3>
                    <p className="text-[#cbbc90] text-sm font-normal leading-normal">Designing unique and personal celebrations for life's special moments.</p>
                  </div>
                </div>
                <div className="flex gap-4 rounded-xl border border-[#685a31]/50 bg-[#342d18]/50 p-6 flex-col text-center items-center hover:bg-[#342d18]/70 hover:border-primary/50 transition-all transform hover:scale-105 cursor-pointer w-full sm:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)] xl:flex-[0_0_calc(25%-18px)]">
                  <span className="material-symbols-outlined text-primary text-4xl">campaign</span>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-white text-lg font-bold leading-tight">Brand Activations</h3>
                    <p className="text-[#cbbc90] text-sm font-normal leading-normal">Creating immersive brand experiences that captivate your audience.</p>
                  </div>
                </div>
                <div className="flex gap-4 rounded-xl border border-[#685a31]/50 bg-[#342d18]/50 p-6 flex-col text-center items-center hover:bg-[#342d18]/70 hover:border-primary/50 transition-all transform hover:scale-105 cursor-pointer w-full sm:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)] xl:flex-[0_0_calc(25%-18px)]">
                  <span className="material-symbols-outlined text-primary text-4xl">laptop_chromebook</span>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-white text-lg font-bold leading-tight">Virtual Experiences</h3>
                    <p className="text-[#cbbc90] text-sm font-normal leading-normal">Producing engaging and seamless virtual events for a global reach.</p>
                  </div>
                </div>
                <div className="flex gap-4 rounded-xl border border-[#685a31]/50 bg-[#342d18]/50 p-6 flex-col text-center items-center hover:bg-[#342d18]/70 hover:border-primary/50 transition-all transform hover:scale-105 cursor-pointer w-full sm:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)] xl:flex-[0_0_calc(25%-18px)]">
                  <span className="material-symbols-outlined text-primary text-4xl">school</span>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-white text-lg font-bold leading-tight">Educational Events</h3>
                    <p className="text-[#cbbc90] text-sm font-normal leading-normal">Designing seminars, workshops, and academic events that inspire learning.</p>
                  </div>
                </div>
                <div className="flex gap-4 rounded-xl border border-[#685a31]/50 bg-[#342d18]/50 p-6 flex-col text-center items-center hover:bg-[#342d18]/70 hover:border-primary/50 transition-all transform hover:scale-105 cursor-pointer w-full sm:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)] xl:flex-[0_0_calc(25%-18px)]">
                  <span className="material-symbols-outlined text-primary text-4xl">developer_mode</span>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-white text-lg font-bold leading-tight">Technical Events</h3>
                    <p className="text-[#cbbc90] text-sm font-normal leading-normal">Orchestrating hackathons, tech fests, and innovation drives for future-ready talent.</p>
                  </div>
                </div>
              </div>
            </div>
            <div id="services" className="mt-20 scroll-mt-24">
              <h2 className="text-white text-3xl md:text-4xl font-bold leading-tight tracking-[-0.015em] pb-8 pt-5 text-center">Signature Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative group overflow-hidden rounded-xl shadow-lg">
                  <img alt="A corporate conference hall with a large screen and audience" className="w-full h-96 object-cover transform group-hover:scale-110 transition-transform duration-500" src="/tech_summit.jpg"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-8">
                    <h3 className="text-white text-2xl font-bold">The Tech Summit</h3>
                  </div>
                </div>
                <div className="relative group overflow-hidden rounded-xl shadow-lg">
                  <img alt="An outdoor wedding reception setup at dusk with string lights" className="w-full h-96 object-cover transform group-hover:scale-110 transition-transform duration-500" src="/expo2.avif"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-8">
                    <h3 className="text-white text-2xl font-bold">The Expos</h3>
                  </div>
                </div>
                
              </div>
            </div>
            <div id="gallery" className="mt-20 scroll-mt-24">
              <h2 className="text-white text-3xl md:text-4xl font-bold leading-tight tracking-[-0.015em] pb-4 pt-5 text-center">Event Gallery</h2>
              <p className="text-[#cbbc90] text-sm md:text-base text-center max-w-2xl mx-auto mb-6">
                A curated glimpse into the experiences we craft – glide through our signature events and stories.
              </p>

              <div className="mt-6 flex w-full justify-center px-2">
                <ImageGallery />
              </div>
            </div>
            <div id="register" className="mt-20 scroll-mt-24">
              <h2 className="text-white text-3xl md:text-4xl font-bold leading-tight tracking-[-0.015em] pb-4 pt-5 text-center">EDUNEXT EXPO – Registration Form</h2>
              
              {/* Event Information Banner */}
              <div className="max-w-4xl mx-auto mb-8 bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-primary text-sm font-semibold mb-1">Event Date</p>
                    <p className="text-white text-lg font-bold">27 December</p>
                  </div>
                  <div>
                    <p className="text-primary text-sm font-semibold mb-1">Event Time</p>
                    <p className="text-white text-lg font-bold">9:00 AM – 5:00 PM</p>
                  </div>
                  <div>
                    <p className="text-primary text-sm font-semibold mb-1">Registration Fee</p>
                    <p className="text-white text-lg font-bold">₹500 per student</p>
                    <p className="text-white/70 text-xs mt-1">(food not included)</p>
                  </div>
                </div>
              </div>

              <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-8 bg-[#342d18]/50 p-8 sm:p-10 rounded-xl border border-[#685a31]/50 shadow-xl">
                  
                  {/* Success/Error Message */}
                  {submitMessage && (
                    <div 
                      id={submitMessage.type === 'success' ? 'registration-success-message' : 'registration-error-message'}
                      className={`p-4 rounded-lg ${
                        submitMessage.type === 'success' 
                          ? 'bg-green-500/20 border border-green-500 text-green-200' 
                          : 'bg-red-500/20 border border-red-500 text-red-200'
                      }`}
                    >
                      {submitMessage.text}
                    </div>
                  )}
                  
                  {/* Student Details Section */}
                  <div className="border-b border-[#685a31]/50 pb-6">
                    <h3 className="text-primary text-xl font-bold mb-6 flex items-center gap-2">
                      <span className="material-symbols-outlined text-2xl">person</span>
                      Student Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2" htmlFor="student-name">Name <span className="text-primary">*</span></label>
                        <input className="block w-full bg-[#221e10]/80 border border-[#685a31] rounded-md shadow-sm py-2.5 px-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" id="student-name" name="studentName" type="text" placeholder="Enter student name" value={formData.studentName} onChange={handleInputChange} required/>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2" htmlFor="class-grade">Class / Grade <span className="text-primary">*</span></label>
                        <input className="block w-full bg-[#221e10]/80 border border-[#685a31] rounded-md shadow-sm py-2.5 px-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" id="class-grade" name="studentClass" type="text" placeholder="e.g., 10th Grade" value={formData.studentClass} onChange={handleInputChange} required/>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2" htmlFor="school-name">School Name <span className="text-primary">*</span></label>
                        <input className="block w-full bg-[#221e10]/80 border border-[#685a31] rounded-md shadow-sm py-2.5 px-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" id="school-name" name="schoolName" type="text" placeholder="Enter school name" value={formData.schoolName} onChange={handleInputChange} required/>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2" htmlFor="contact-number">Contact Number <span className="text-primary">*</span></label>
                        <input className="block w-full bg-[#221e10]/80 border border-[#685a31] rounded-md shadow-sm py-2.5 px-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" id="contact-number" name="studentContact" type="tel" placeholder="Enter contact number" value={formData.studentContact} onChange={handleInputChange} required/>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-white/80 mb-2" htmlFor="email-id">Email ID <span className="text-primary">*</span></label>
                        <input className="block w-full bg-[#221e10]/80 border border-[#685a31] rounded-md shadow-sm py-2.5 px-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" id="email-id" name="studentEmail" type="email" placeholder="Enter email address" value={formData.studentEmail} onChange={handleInputChange} required/>
                      </div>
                    </div>
                  </div>

                  {/* Sibling Details Section */}
                  <div className="border-b border-[#685a31]/50 pb-6">
                    <h3 className="text-primary text-xl font-bold mb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-2xl">group</span>
                      Sibling Details
                    </h3>
                    <p className="text-white/60 text-sm mb-6">(Please provide details of siblings, if any)</p>
                    
                    <div className="space-y-6">
                      <div className="bg-[#221e10]/40 rounded-lg p-5 border border-[#685a31]/30">
                        <h4 className="text-white font-semibold mb-4">Sibling 1</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-white/80 mb-2" htmlFor="sibling1-name">Name</label>
                            <input className="block w-full bg-[#221e10]/80 border border-[#685a31] rounded-md shadow-sm py-2 px-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm" id="sibling1-name" name="sibling1Name" type="text" placeholder="Sibling 1 name" value={formData.sibling1Name} onChange={handleInputChange}/>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-white/80 mb-2" htmlFor="sibling1-school">School/College</label>
                            <input className="block w-full bg-[#221e10]/80 border border-[#685a31] rounded-md shadow-sm py-2 px-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm" id="sibling1-school" name="sibling1School" type="text" placeholder="School/College name" value={formData.sibling1School} onChange={handleInputChange}/>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-white/80 mb-2" htmlFor="sibling1-class">Class/Year</label>
                            <input className="block w-full bg-[#221e10]/80 border border-[#685a31] rounded-md shadow-sm py-2 px-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm" id="sibling1-class" name="sibling1Class" type="text" placeholder="Class/Year" value={formData.sibling1Class} onChange={handleInputChange}/>
                          </div>
                        </div>
                      </div>

                      <div className="bg-[#221e10]/40 rounded-lg p-5 border border-[#685a31]/30">
                        <h4 className="text-white font-semibold mb-4">Sibling 2</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-white/80 mb-2" htmlFor="sibling2-name">Name</label>
                            <input className="block w-full bg-[#221e10]/80 border border-[#685a31] rounded-md shadow-sm py-2 px-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm" id="sibling2-name" name="sibling2Name" type="text" placeholder="Sibling 2 name" value={formData.sibling2Name} onChange={handleInputChange}/>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-white/80 mb-2" htmlFor="sibling2-school">School/College</label>
                            <input className="block w-full bg-[#221e10]/80 border border-[#685a31] rounded-md shadow-sm py-2 px-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm" id="sibling2-school" name="sibling2School" type="text" placeholder="School/College name" value={formData.sibling2School} onChange={handleInputChange}/>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-white/80 mb-2" htmlFor="sibling2-class">Class/Year</label>
                            <input className="block w-full bg-[#221e10]/80 border border-[#685a31] rounded-md shadow-sm py-2 px-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm" id="sibling2-class" name="sibling2Class" type="text" placeholder="Class/Year" value={formData.sibling2Class} onChange={handleInputChange}/>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Parent/Guardian Details Section */}
                  <div className="border-b border-[#685a31]/50 pb-6">
                    <h3 className="text-primary text-xl font-bold mb-6 flex items-center gap-2">
                      <span className="material-symbols-outlined text-2xl">family_restroom</span>
                      Parent/Guardian Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2" htmlFor="parent-name">Parent/Guardian Name <span className="text-primary">*</span></label>
                        <input className="block w-full bg-[#221e10]/80 border border-[#685a31] rounded-md shadow-sm py-2.5 px-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" id="parent-name" name="parentName" type="text" placeholder="Enter parent/guardian name" value={formData.parentName} onChange={handleInputChange} required/>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2" htmlFor="parent-contact">Contact Number <span className="text-primary">*</span></label>
                        <input className="block w-full bg-[#221e10]/80 border border-[#685a31] rounded-md shadow-sm py-2.5 px-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" id="parent-contact" name="parentContact" type="tel" placeholder="Enter contact number" value={formData.parentContact} onChange={handleInputChange} required/>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-white/80 mb-2" htmlFor="parent-signature">Signature of Parent/Guardian (Upload Image) <span className="text-primary">*</span></label>
                        <input className="block w-full bg-[#221e10]/80 border border-[#685a31] rounded-md shadow-sm py-2.5 px-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" id="parent-signature" name="parentSignature" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleParentSignatureChange}/>
                        {parentSignaturePreview && (
                          <div className="mt-2">
                            <img src={parentSignaturePreview} alt="Parent signature preview" className="max-w-xs max-h-32 border border-[#685a31] rounded"/>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Competitions Section */}
                  <div className="border-b border-[#685a31]/50 pb-6">
                    <h3 className="text-primary text-xl font-bold mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-2xl">emoji_events</span>
                      Competitions
                    </h3>
                    <p className="text-white/60 text-sm mb-4">(Tick any you want to join)</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {['Academic Quiz', 'Science Innovators Challenge', 'Chess Tournament', 'Public Speaking Contest', 'Art & Creativity Challenge'].map((competition, index) => (
                        <div key={index} className="flex items-center p-3 bg-[#221e10]/40 rounded-lg border border-[#685a31]/30 hover:border-primary/50 transition-colors">
                          <input className="h-5 w-5 rounded border border-[#685a31] bg-[#221e10]/80 text-primary focus:ring-primary cursor-pointer" id={`competition-${index}`} name="competitions" type="checkbox" value={competition} checked={formData.competitions.includes(competition)} onChange={handleInputChange}/>
                          <label className="ml-3 text-sm font-medium text-white/90 cursor-pointer" htmlFor={`competition-${index}`}>{competition}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Workshops Section */}
                  <div className="border-b border-[#685a31]/50 pb-6">
                    <h3 className="text-primary text-xl font-bold mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-2xl">workspace_premium</span>
                      Workshops
                    </h3>
                    <p className="text-white/60 text-sm mb-4">(Tick preferred workshops)</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {['Artificial Intelligence for Beginners', 'Financial Literacy & Money Management', 'Entrepreneurship Foundation', 'Business Development & Leadership'].map((workshop, index) => (
                        <div key={index} className="flex items-center p-3 bg-[#221e10]/40 rounded-lg border border-[#685a31]/30 hover:border-primary/50 transition-colors">
                          <input className="h-5 w-5 rounded border border-[#685a31] bg-[#221e10]/80 text-primary focus:ring-primary cursor-pointer" id={`workshop-${index}`} name="workshops" type="checkbox" value={workshop} checked={formData.workshops.includes(workshop)} onChange={handleInputChange}/>
                          <label className="ml-3 text-sm font-medium text-white/90 cursor-pointer" htmlFor={`workshop-${index}`}>{workshop}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment Details Section */}
                  <div className="border-b border-[#685a31]/50 pb-6">
                    <h3 className="text-primary text-xl font-bold mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-2xl">payments</span>
                      Payment Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-[#221e10]/40 rounded-lg p-6 border border-[#685a31]/30">
                        <p className="text-white font-semibold mb-4 text-center">Scan QR Code to Pay</p>
                        <div className="bg-white rounded-lg p-4 flex items-center justify-center min-h-[200px]">
                          <div className="text-center">
                            <div className="w-70 h-80 mx-auto bg-gray-200 rounded-lg flex items-center justify-center mb-3">
                              <img src="/scanner.jpg" alt="paytm scanner image" style={{height: '100%', width: '100%'}} />
                            </div>
                            <p className="text-gray-600 text-sm">QR Code Image</p>
                            <p className="text-gray-500 text-xs mt-2">Amount: ₹500</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2" htmlFor="payment-screenshot">Upload Payment Screenshot <span className="text-primary">*</span></label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-[#685a31] rounded-lg hover:border-primary transition-colors">
                          <div className="space-y-1 text-center">
                            {paymentScreenshotPreview ? (
                              <div>
                                <img src={paymentScreenshotPreview} alt="Payment screenshot preview" className="max-w-full max-h-48 mx-auto border border-[#685a31] rounded mb-2"/>
                                <p className="text-xs text-white/70">{paymentScreenshot?.name}</p>
                                <button type="button" onClick={() => { setPaymentScreenshot(null); setPaymentScreenshotPreview(null); }} className="text-xs text-primary hover:text-primary/80 mt-2">Remove</button>
                              </div>
                            ) : (
                              <>
                                <span className="material-symbols-outlined text-4xl text-white/40">cloud_upload</span>
                                <div className="flex text-sm text-white/60">
                                  <label htmlFor="payment-screenshot" className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80">
                                    <span>Upload a file</span>
                                    <input id="payment-screenshot" name="payment-screenshot" type="file" className="sr-only" accept="image/jpeg,image/png,image/webp" onChange={handlePaymentScreenshotChange} required/>
                                  </label>
                                  <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-white/50">PNG, JPG, WEBP up to 10MB</p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-white/80 mb-2" htmlFor="payment-mode">Payment Mode <span className="text-primary">*</span></label>
                        <select className="block w-full bg-[#221e10]/80 border border-[#685a31] rounded-md shadow-sm py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" id="payment-mode" name="paymentMode" value={formData.paymentMode} onChange={handleInputChange} required>
                          <option value="">Select payment mode</option>
                          <option value="UPI">UPI</option>
                          <option value="Bank Transfer">Bank Transfer</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-white/80 mb-2" htmlFor="transaction-id">Transaction ID <span className="text-primary">*</span></label>
                        <input className="block w-full bg-[#221e10]/80 border border-[#685a31] rounded-md shadow-sm py-2.5 px-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" id="transaction-id" name="transactionId" type="text" placeholder="Enter transaction ID" value={formData.transactionId} onChange={handleInputChange} required/>
                      </div>
                    </div>
                  </div>

                

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button 
                      className="w-full flex justify-center items-center gap-2 py-4 px-6 border border-transparent rounded-lg shadow-lg text-base font-bold text-background-dark bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background-dark transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed" 
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="material-symbols-outlined animate-spin">sync</span>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined">check_circle</span>
                          Submit Registration
                        </>
                      )}
                    </button>
                    <p className="text-white/60 text-xs text-center mt-3">By submitting this form, you agree to the terms and conditions</p>
                  </div>
                </form>
              </div>
            </div>
        </div>
      </div>
      
      {/* Footer - Full width outside constrained container */}
      <footer className="w-full border-t border-solid border-white/20 dark:border-t-[#493f22] pt-10 pb-8">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-16 xl:px-24">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 text-white justify-center md:justify-start">
                <img
                  src="/logo2.png"
                  alt="Skykeen logo"
                  className="h-12 w-auto md:h-14 object-contain"
                />
              </div>
              <p className="mt-4 text-sm text-[#cbbc90]">Crafting timeless experiences with elegance and precision. Your vision, our expertise.</p>
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Quick Links</h3>
              <ul className="mt-4 space-y-2">
                <li><a className="text-sm text-[#cbbc90] hover:text-primary transition-colors" href="#" onClick={(e) => { e.preventDefault(); document.getElementById('expertise')?.scrollIntoView({ behavior: 'smooth' }); }}>About Us</a></li>
                <li><a className="text-sm text-[#cbbc90] hover:text-primary transition-colors" href="#" onClick={(e) => { e.preventDefault(); document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }); }}>Services</a></li>
                <li><a className="text-sm text-[#cbbc90] hover:text-primary transition-colors" href="#" onClick={(e) => { e.preventDefault(); document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' }); }}>Gallery</a></li>
                <li><a className="text-sm text-[#cbbc90] hover:text-primary transition-colors" href="#" onClick={(e) => { e.preventDefault(); document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' }); }}>Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Contact Us</h3>
              <ul className="mt-4 space-y-2">
                <li className="text-sm text-[#cbbc90]">info.skykeen@gmail.com</li>
                <li className="text-sm text-[#cbbc90]">+91 74062 38503</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="w-full mt-8 border-t border-solid border-white/20 dark:border-t-[#493f22] pt-6">
          <div className="w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-16 xl:px-24 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-[#cbbc90]">© 2024 Skykeen. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 sm:mt-0">
              <a className="text-[#cbbc90] hover:text-primary transition-colors" href="#">
                <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path clipRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" fillRule="evenodd"></path></svg>
              </a>
              <a className="text-[#cbbc90] hover:text-primary transition-colors" href="#">
                <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg>
              </a>
              <a className="text-[#cbbc90] hover:text-primary transition-colors" href="#">
                <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path clipRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.013-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.345 2.525c.636-.247 1.363-.416 2.427-.465C9.793 2.013 10.147 2 12.315 2h.001zm-1.04 4.041a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM12 18a6 6 0 100-12 6 6 0 000 12z" fillRule="evenodd"></path></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;


