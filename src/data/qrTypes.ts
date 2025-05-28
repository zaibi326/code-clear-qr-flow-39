
import { 
  Link, 
  FileText, 
  MapPin, 
  Menu, 
  FormInput, 
  Settings, 
  Share2, 
  Globe, 
  Smartphone, 
  Tag, 
  Navigation, 
  Facebook, 
  Building, 
  Image, 
  Music, 
  Mail, 
  Phone, 
  MessageSquare
} from 'lucide-react';

export interface QRType {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  category: 'frequently-used' | 'more-types';
  isNew?: boolean;
  color: string;
  qrType: 'url' | 'text' | 'email' | 'phone' | 'wifi' | 'vcard' | 'pdf' | 'location';
  placeholder: string;
  prefix?: string;
}

export const qrTypes: QRType[] = [
  // Frequently Used
  {
    id: 'url',
    title: 'URL/Link',
    description: 'Paste link to a website, video, form, or any URL you have',
    icon: Link,
    category: 'frequently-used',
    color: 'bg-blue-500',
    qrType: 'url',
    placeholder: 'https://example.com',
    prefix: 'https://'
  },
  {
    id: 'multi-link',
    title: 'Multi-link QR Codes',
    description: 'Create a Linkpage with a list of links and share it with a QR Code',
    icon: Share2,
    category: 'frequently-used',
    isNew: true,
    color: 'bg-purple-500',
    qrType: 'url',
    placeholder: 'https://linktr.ee/yourprofile',
    prefix: 'https://'
  },
  {
    id: 'pdf',
    title: 'PDF',
    description: 'Link a PDF document and distribute it efficiently',
    icon: FileText,
    category: 'frequently-used',
    color: 'bg-red-500',
    qrType: 'url',
    placeholder: 'https://example.com/document.pdf',
    prefix: 'https://'
  },
  {
    id: 'location',
    title: 'Location',
    description: 'Point to any location on Google Maps',
    icon: MapPin,
    category: 'frequently-used',
    color: 'bg-green-500',
    qrType: 'location',
    placeholder: 'Enter address or coordinates',
    prefix: 'geo:'
  },
  // More QR Code Types
  {
    id: 'restaurant-menu',
    title: 'Restaurant Menu',
    description: 'Organize all your QR menus in one digital location',
    icon: Menu,
    category: 'more-types',
    color: 'bg-orange-500',
    qrType: 'url',
    placeholder: 'https://menu.restaurant.com',
    prefix: 'https://'
  },
  {
    id: 'form',
    title: 'Form',
    description: 'Design a form and get responses through scans',
    icon: FormInput,
    category: 'more-types',
    isNew: true,
    color: 'bg-indigo-500',
    qrType: 'url',
    placeholder: 'https://forms.google.com/...',
    prefix: 'https://'
  },
  {
    id: 'smart-rules',
    title: 'Smart Rules',
    description: 'Create smarter QR Codes that redirect based on logical conditions',
    icon: Settings,
    category: 'more-types',
    color: 'bg-gray-600',
    qrType: 'url',
    placeholder: 'https://smartlink.com',
    prefix: 'https://'
  },
  {
    id: 'social-media',
    title: 'Social Media',
    description: 'Link to your social media channels for more engagement',
    icon: Share2,
    category: 'more-types',
    color: 'bg-pink-500',
    qrType: 'url',
    placeholder: 'https://instagram.com/username',
    prefix: 'https://'
  },
  {
    id: 'landing-page',
    title: 'Landing Page',
    description: 'Build a mobile-optimized webpage to interact with your audience',
    icon: Globe,
    category: 'more-types',
    color: 'bg-cyan-500',
    qrType: 'url',
    placeholder: 'https://landingpage.com',
    prefix: 'https://'
  },
  {
    id: 'mobile-app',
    title: 'Mobile App',
    description: 'Redirect to app download or in-app pages for Android and iOS users',
    icon: Smartphone,
    category: 'more-types',
    color: 'bg-slate-600',
    qrType: 'url',
    placeholder: 'https://apps.apple.com/app/...',
    prefix: 'https://'
  },
  {
    id: 'coupon',
    title: 'Coupon Code',
    description: 'Route to a page displaying coupon code details',
    icon: Tag,
    category: 'more-types',
    color: 'bg-yellow-500',
    qrType: 'text',
    placeholder: 'SAVE20OFF',
    prefix: ''
  },
  {
    id: 'geolocation',
    title: 'Geolocation Redirect',
    description: 'Show a specific website URL based on the scanner\'s country',
    icon: Navigation,
    category: 'more-types',
    color: 'bg-teal-500',
    qrType: 'url',
    placeholder: 'https://geo-redirect.com',
    prefix: 'https://'
  },
  {
    id: 'facebook',
    title: 'Facebook Page',
    description: 'Redirect to the "like" button of your Facebook page',
    icon: Facebook,
    category: 'more-types',
    color: 'bg-blue-600',
    qrType: 'url',
    placeholder: 'https://facebook.com/yourpage',
    prefix: 'https://facebook.com/'
  },
  {
    id: 'business',
    title: 'Business Page',
    description: 'Link to a page containing your business details',
    icon: Building,
    category: 'more-types',
    color: 'bg-emerald-500',
    qrType: 'vcard',
    placeholder: 'Business Name',
    prefix: ''
  },
  {
    id: 'image',
    title: 'Image',
    description: 'Show a photo',
    icon: Image,
    category: 'more-types',
    color: 'bg-violet-500',
    qrType: 'url',
    placeholder: 'https://example.com/image.jpg',
    prefix: 'https://'
  },
  {
    id: 'mp3',
    title: 'MP3',
    description: 'Play an audio file',
    icon: Music,
    category: 'more-types',
    color: 'bg-rose-500',
    qrType: 'url',
    placeholder: 'https://example.com/audio.mp3',
    prefix: 'https://'
  },
  {
    id: 'email',
    title: 'Email',
    description: 'Link to receive email messages',
    icon: Mail,
    category: 'more-types',
    color: 'bg-amber-500',
    qrType: 'email',
    placeholder: 'contact@example.com',
    prefix: 'mailto:'
  },
  {
    id: 'call',
    title: 'Call',
    description: 'Link to your phone number for quick calls',
    icon: Phone,
    category: 'more-types',
    color: 'bg-lime-500',
    qrType: 'phone',
    placeholder: '+1234567890',
    prefix: 'tel:'
  },
  {
    id: 'sms',
    title: 'SMS',
    description: 'Redirect to your mobile number to receive SMS',
    icon: MessageSquare,
    category: 'more-types',
    color: 'bg-sky-500',
    qrType: 'phone',
    placeholder: '+1234567890',
    prefix: 'sms:'
  }
];
