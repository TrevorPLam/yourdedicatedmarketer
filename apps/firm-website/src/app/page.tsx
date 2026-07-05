import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Container, Section } from '@repo/ui';
import { Header } from '../components/header';

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Section>
          <Container>
            <div className="text-center p-8">
              <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-50 mb-4">
                Your Dedicated Marketer
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                Professional marketing services to grow your business
              </p>
              <Button size="lg">
                Get Started
              </Button>
            </div>
          </Container>
        </Section>
        <Section>
          <Container>
            <Card>
              <CardHeader>
                <CardTitle>Test Card</CardTitle>
                <CardDescription>This is a test card component</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Card content goes here</p>
              </CardContent>
            </Card>
          </Container>
        </Section>
      </main>
    </>
  );
}
