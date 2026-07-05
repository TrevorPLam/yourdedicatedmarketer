import { Container, Section } from '@repo/ui';
import { CheckCircle2 } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: <CheckCircle2 className="h-8 w-8 text-primary" />,
      title: 'Discovery',
      description: 'We learn about your business, goals, and target audience to create a tailored marketing strategy.',
    },
    {
      icon: <CheckCircle2 className="h-8 w-8 text-primary" />,
      title: 'Design & Build',
      description: 'Our team designs and builds your website or marketing materials with your input at every step.',
    },
    {
      icon: <CheckCircle2 className="h-8 w-8 text-primary" />,
      title: 'Launch',
      description: 'We launch your website or campaign and ensure everything is working perfectly.',
    },
    {
      icon: <CheckCircle2 className="h-8 w-8 text-primary" />,
      title: 'Ongoing Support',
      description: 'We provide ongoing support, maintenance, and optimization to help you grow.',
    },
  ];

  return (
    <Section>
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our simple 4-step process ensures you get results without the complexity.
          </p>
        </div>
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.title} className="text-center">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="bg-primary/10 rounded-full p-4">{step.icon}</div>
                  <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
