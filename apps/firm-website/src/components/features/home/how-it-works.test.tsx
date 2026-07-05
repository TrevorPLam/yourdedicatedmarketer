import { render, screen } from '@testing-library/react';
import { HowItWorks } from './how-it-works';

describe('HowItWorks', () => {
  it('renders section title', () => {
    render(<HowItWorks />);
    expect(screen.getByText('How It Works')).toBeInTheDocument();
  });

  it('renders section description', () => {
    render(<HowItWorks />);
    expect(
      screen.getByText(/Our simple 4-step process ensures you get results/)
    ).toBeInTheDocument();
  });

  it('renders four step cards', () => {
    render(<HowItWorks />);
    const stepHeadings = screen.getAllByRole('heading', { level: 3 });
    expect(stepHeadings).toHaveLength(4);
  });

  it('renders Discovery step', () => {
    render(<HowItWorks />);
    expect(screen.getByText('Discovery')).toBeInTheDocument();
    expect(
      screen.getByText(/We learn about your business, goals, and target audience/)
    ).toBeInTheDocument();
  });

  it('renders Design & Build step', () => {
    render(<HowItWorks />);
    expect(screen.getByText('Design & Build')).toBeInTheDocument();
    expect(
      screen.getByText(/Our team designs and builds your website/)
    ).toBeInTheDocument();
  });

  it('renders Launch step', () => {
    render(<HowItWorks />);
    expect(screen.getByText('Launch')).toBeInTheDocument();
    expect(
      screen.getByText(/We launch your website or campaign/)
    ).toBeInTheDocument();
  });

  it('renders Ongoing Support step', () => {
    render(<HowItWorks />);
    expect(screen.getByText('Ongoing Support')).toBeInTheDocument();
    expect(
      screen.getByText(/We provide ongoing support, maintenance/)
    ).toBeInTheDocument();
  });

  it('renders step numbers', () => {
    render(<HowItWorks />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });
});
