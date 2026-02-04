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
    <div className="flex h-full items-center justify-center rounded-lg bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-500" />
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
      <div className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-200">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent">
                  Icons Showcase
                </h1>
                <p className="text-sm text-slate-500">
                  New Aesthetic PDF style with improved SVG icons
                </p>
              </div>
            </div>
            <Button onClick={handleDownload} size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Feature Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, index) => (
            <Card
              key={index}
              className="border-slate-200/60 bg-white/80 backdrop-blur-sm transition-shadow hover:shadow-lg"
            >
              <CardContent className="p-4">
                <div
                  className={`h-10 w-10 rounded-lg ${feature.color} mb-3 flex items-center justify-center`}
                >
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-1 font-semibold text-slate-800">
                  {feature.title}
                </h3>
                <p className="text-xs leading-relaxed text-slate-500">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left: Icons List */}
          <div className="space-y-4 lg:col-span-1">
            <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Layout className="h-4 w-4 text-indigo-500" />
                  Icons Used
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {ICONS_USED.map((item, index) => (
                    <div
                      key={index}
                      className="group flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-slate-50"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 transition-colors group-hover:bg-indigo-50">
                        <item.icon className="h-4 w-4 text-slate-600 transition-colors group-hover:text-indigo-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-700">
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
                <CardTitle className="flex items-center gap-2 text-base">
                  <Palette className="h-4 w-4 text-pink-500" />
                  Color Palette
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-md bg-indigo-500 shadow-sm" />
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        Primary
                      </p>
                      <p className="text-xs text-slate-400">#6366f1</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-md bg-pink-500 shadow-sm" />
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        Secondary
                      </p>
                      <p className="text-xs text-slate-400">#ec4899</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-md bg-teal-500 shadow-sm" />
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
                <CardTitle className="flex items-center gap-2 text-base">
                  <Type className="h-4 w-4 text-teal-500" />
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
                <p className="mt-3 text-xs text-slate-500">
                  All icons now accept configurable props for maximum
                  flexibility in different contexts.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right: PDF Preview */}
          <div className="lg:col-span-2">
            <Card className="h-[calc(100vh-280px)] border-slate-200/60 bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    Aesthetic Style Preview
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      A4 Format
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-indigo-200 bg-indigo-50 text-xs text-indigo-600"
                    >
                      New Style
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-[calc(100%-60px)] p-0">
                <div className="h-full bg-slate-50/50 p-4">
                  <div className="h-full overflow-hidden rounded-lg shadow-2xl">
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
