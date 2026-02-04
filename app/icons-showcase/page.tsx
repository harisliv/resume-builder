'use client';

import dynamic from 'next/dynamic';
import { extendedMockResumeData } from '@/lib/ResumePDF/mockdata';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Document, pdf } from '@react-pdf/renderer';
import { AestheticDocument } from '@/lib/ResumePDF/documents';
import {
  Palette,
  Type,
  Layout,
  Sparkles,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Globe,
  Github,
  Briefcase,
  GraduationCap,
  Calendar,
  Building2,
  Download
} from 'lucide-react';

// Dynamic import for the PDF viewer with AestheticDocument
const AestheticPDFViewer = dynamic(() => import('./AestheticPDFViewer'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-slate-50 rounded-lg">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-sm text-slate-500">Loading PDF preview...</p>
      </div>
    </div>
  )
});

// Icons used in the Aesthetic style
const ICONS_USED = [
  { name: 'MailIcon', icon: Mail, usage: 'Contact email' },
  { name: 'PhoneIcon', icon: Phone, usage: 'Contact phone' },
  { name: 'MapPinIcon', icon: MapPin, usage: 'Location' },
  { name: 'LinkedInIcon', icon: Linkedin, usage: 'LinkedIn profile' },
  { name: 'GlobeIcon', icon: Globe, usage: 'Website/portfolio' },
  { name: 'GitHubIcon', icon: Github, usage: 'GitHub profile' },
  { name: 'BriefcaseIcon', icon: Briefcase, usage: 'Experience section' },
  { name: 'BuildingIcon', icon: Building2, usage: 'Company name' },
  {
    name: 'GraduationCapIcon',
    icon: GraduationCap,
    usage: 'Education section'
  },
  { name: 'CalendarIcon', icon: Calendar, usage: 'Date ranges' },
  { name: 'SparklesIcon', icon: Sparkles, usage: 'Skills section' }
];

const FEATURES = [
  {
    title: 'Aesthetic Design',
    description:
      'Modern, soft color palette with indigo, pink, and teal accents',
    icon: Palette,
    color: 'bg-indigo-100 text-indigo-600'
  },
  {
    title: 'Configurable Icons',
    description: 'All icons accept size, color, strokeWidth, and fill props',
    icon: Type,
    color: 'bg-pink-100 text-pink-600'
  },
  {
    title: 'New Icons',
    description: 'Calendar, Building, and GitHub icons for richer content',
    icon: Layout,
    color: 'bg-teal-100 text-teal-600'
  },
  {
    title: 'Polished Cards',
    description: 'Beautiful card layouts with subtle borders and shadows',
    icon: Sparkles,
    color: 'bg-amber-100 text-amber-600'
  }
];

export default function IconsShowcasePage() {
  const handleDownload = async () => {
    const doc = (
      <Document>
        <AestheticDocument data={extendedMockResumeData} />
      </Document>
    );

    const instance = pdf(doc);
    const blob = await instance.toBlob();

    const fileName = extendedMockResumeData.personalInfo?.fullName
      ? `${extendedMockResumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`
      : 'Aesthetic_Resume.pdf';

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';

    document.body.appendChild(link);

    setTimeout(() => {
      link.click();

      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
        URL.revokeObjectURL(url);
      }, 100);
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Icons Showcase
                </h1>
                <p className="text-sm text-slate-500">
                  New Aesthetic PDF style with improved SVG icons
                </p>
              </div>
            </div>
            <Button onClick={handleDownload} size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {FEATURES.map((feature, index) => (
            <Card
              key={index}
              className="border-slate-200/60 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-4">
                <div
                  className={`w-10 h-10 rounded-lg ${feature.color} flex items-center justify-center mb-3`}
                >
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-1">
                  {feature.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Icons List */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Layout className="w-4 h-4 text-indigo-500" />
                  Icons Used
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {ICONS_USED.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                        <item.icon className="w-4 h-4 text-slate-600 group-hover:text-indigo-600 transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-700 truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-slate-400">{item.usage}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Palette className="w-4 h-4 text-pink-500" />
                  Color Palette
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-md bg-indigo-500 shadow-sm" />
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        Primary
                      </p>
                      <p className="text-xs text-slate-400">#6366f1</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-md bg-pink-500 shadow-sm" />
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        Secondary
                      </p>
                      <p className="text-xs text-slate-400">#ec4899</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-md bg-teal-500 shadow-sm" />
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        Accent
                      </p>
                      <p className="text-xs text-slate-400">#14b8a6</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Type className="w-4 h-4 text-teal-500" />
                  Icon Props
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <Badge variant="secondary" className="font-mono text-xs">
                    size?: number
                  </Badge>
                  <Badge variant="secondary" className="font-mono text-xs">
                    color?: string
                  </Badge>
                  <Badge variant="secondary" className="font-mono text-xs">
                    strokeWidth?: number
                  </Badge>
                  <Badge variant="secondary" className="font-mono text-xs">
                    fill?: string
                  </Badge>
                  <Badge variant="secondary" className="font-mono text-xs">
                    style?: object
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 mt-3">
                  All icons now accept configurable props for maximum
                  flexibility in different contexts.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right: PDF Preview */}
          <div className="lg:col-span-2">
            <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm h-[calc(100vh-280px)]">
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Aesthetic Style Preview
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      A4 Format
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-xs bg-indigo-50 text-indigo-600 border-indigo-200"
                    >
                      New Style
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 h-[calc(100%-60px)]">
                <div className="h-full p-4 bg-slate-50/50">
                  <div className="h-full rounded-lg overflow-hidden shadow-2xl">
                    <AestheticPDFViewer data={extendedMockResumeData} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
