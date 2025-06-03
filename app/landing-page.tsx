'use client';

import { Button } from '@/components/ui/button';
import { SignedOut, UserButton } from '@clerk/nextjs';
import { SignedIn } from '@clerk/nextjs';
import { SignInButton } from '@clerk/nextjs';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { motion } from 'framer-motion';

const features = [
  {
    title: 'Auto Followup',
    description:
      'Automatically follow up with your leads and clients at the perfect time',
    icon: '🔄',
  },
  {
    title: 'Lead Conversion',
    description:
      'Convert more leads into clients with smart, personalized follow-ups',
    icon: '📈',
  },
  {
    title: 'Auto Reply',
    description: 'Let AI handle your client communications professionally',
    icon: '💬',
  },
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Sales Director',
    company: 'TechCorp',
    content:
      "This platform has transformed our follow-up process. We've seen a 40% increase in lead conversion!",
    avatar: '👩',
  },
  {
    name: 'Michael Chen',
    role: 'Business Owner',
    company: 'GrowthLabs',
    content:
      "The auto-reply feature saves me hours every week. It's like having a personal assistant!",
    avatar: '👨',
  },
];

const pricingPlans = [
  {
    name: 'Starter',
    price: '$29',
    features: [
      'Up to 100 follow-ups/month',
      'Basic auto-reply',
      'Email support',
    ],
  },
  {
    name: 'Professional',
    price: '$79',
    features: [
      'Unlimited follow-ups',
      'Advanced auto-reply',
      'Priority support',
      'Lead scoring',
    ],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    features: [
      'Custom solutions',
      'Dedicated support',
      'API access',
      'Custom integrations',
    ],
  },
];

export default function LandingPage({
  orgRole,
  userMetadata,
}: {
  orgRole: string;
  userMetadata: { role: string };
}) {
  return (
    <div className='min-h-screen bg-gradient-to-b from-white to-gray-50'>
      {/* Navigation */}
      <nav className='fixed top-0 w-full bg-white/80 backdrop-blur-sm z-50 border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between'>
          <div className='text-2xl font-bold text-blue-600'>AutoFollowUp</div>
          <div className='flex items-center gap-4'>
            <SignedOut>
              <SignInButton>
                <Button>Sign In</Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
              {orgRole === 'org:admin' && (
                <Link href='/dashboard'>Dashboard</Link>
              )}
              {userMetadata.role === 'super_admin' && (
                <Link href='/admin' className='text-blue-500 hover:underline'>
                  Admin
                </Link>
              )}
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className='pt-32 pb-20 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto text-center'>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='text-5xl md:text-6xl font-bold text-gray-900 mb-6'
          >
            Automate Your Client Follow-ups
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className='text-xl text-gray-600 mb-8 max-w-3xl mx-auto'
          >
            Let AI handle your client communications while you focus on growing
            your business
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button size='lg' className='text-lg px-8 py-6'>
              Get Started Free
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-20 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-3xl font-bold text-center mb-12'>
            Powerful Features
          </h2>
          <div className='grid md:grid-cols-3 gap-8'>
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardHeader>
                    <div className='text-4xl mb-4'>{feature.icon}</div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className='py-20 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-3xl font-bold text-center mb-12'>
            What Our Clients Say
          </h2>
          <div className='grid md:grid-cols-2 gap-8'>
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardContent className='pt-6'>
                    <div className='text-4xl mb-4'>{testimonial.avatar}</div>
                    <p className='text-gray-600 mb-4'>{testimonial.content}</p>
                    <div>
                      <p className='font-semibold'>{testimonial.name}</p>
                      <p className='text-sm text-gray-500'>
                        {testimonial.role}, {testimonial.company}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className='py-20 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-3xl font-bold text-center mb-12'>
            Simple, Transparent Pricing
          </h2>
          <div className='grid md:grid-cols-3 gap-8'>
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card
                  className={index === 1 ? 'border-blue-500 shadow-lg' : ''}
                >
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <div className='text-3xl font-bold mt-2'>
                      {plan.price}
                      <span className='text-sm text-gray-500'>/month</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className='space-y-3'>
                      {plan.features.map((feature) => (
                        <li key={feature} className='flex items-center'>
                          <span className='text-green-500 mr-2'>✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className='w-full mt-6'
                      variant={index === 1 ? 'default' : 'outline'}
                    >
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className='py-20 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='max-w-3xl mx-auto text-center'>
            <h2 className='text-3xl font-bold mb-8'>Get in Touch</h2>
            <p className='text-gray-600 mb-8'>
              Have questions? We'd love to hear from you. Send us a message and
              we'll respond as soon as possible.
            </p>
            <Button size='lg'>Contact Us</Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-gray-900 text-white py-12'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid md:grid-cols-4 gap-8'>
            <div>
              <h3 className='text-xl font-bold mb-4'>AutoFollowUp</h3>
              <p className='text-gray-400'>
                Making client communication effortless
              </p>
            </div>
            <div>
              <h4 className='font-semibold mb-4'>Product</h4>
              <ul className='space-y-2 text-gray-400'>
                <li>
                  <Link href='#' className='hover:text-white'>
                    Features
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-white'>
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-white'>
                    Integrations
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className='font-semibold mb-4'>Company</h4>
              <ul className='space-y-2 text-gray-400'>
                <li>
                  <Link href='#' className='hover:text-white'>
                    About
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-white'>
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-white'>
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className='font-semibold mb-4'>Legal</h4>
              <ul className='space-y-2 text-gray-400'>
                <li>
                  <Link href='#' className='hover:text-white'>
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-white'>
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-white'>
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className='border-t border-gray-800 mt-12 pt-8 text-center text-gray-400'>
            <p>© 2024 AutoFollowUp. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
