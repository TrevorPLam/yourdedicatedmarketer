import type { MDXComponents } from 'mdx/types';
import { Button } from '@repo/ui/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@repo/ui/components/ui/card';
import { Container } from '@repo/ui/components/ui/container';
import { Section } from '@repo/ui/components/ui/section';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@repo/ui/components/ui/accordion';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Button,
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
    Container,
    Section,
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
    ...components,
  };
}
