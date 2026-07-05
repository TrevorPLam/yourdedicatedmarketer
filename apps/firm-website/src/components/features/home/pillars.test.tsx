import { render, screen } from '@testing-library/react';
import { Pillars } from './pillars';

describe('Pillars', () => {
  it('renders section title', () => {
    render(<Pillars />);
    expect(screen.getByText('Our Core Services')).toBeInTheDocument();
  });

  it('renders section description', () => {
    render(<Pillars />);
    expect(
      screen.getByText(/We specialize in three pillars of digital marketing/)
    ).toBeInTheDocument();
  });

  it('renders three pillar cards', () => {
    render(<Pillars />);
    const cards = screen.getAllByRole('link');
    expect(cards).toHaveLength(3);
  });

  it('renders Website Design pillar', () => {
    render(<Pillars />);
    expect(screen.getByText('Website Design')).toBeInTheDocument();
    expect(
      screen.getByText(/Professional, conversion-focused websites/)
    ).toBeInTheDocument();
  });

  it('renders Local SEO pillar', () => {
    render(<Pillars />);
    expect(screen.getByText('Local SEO')).toBeInTheDocument();
    expect(
      screen.getByText(/Get found by local customers searching for your services/)
    ).toBeInTheDocument();
  });

  it('renders Paid Advertising pillar', () => {
    render(<Pillars />);
    expect(screen.getByText('Paid Advertising')).toBeInTheDocument();
    expect(
      screen.getByText(/Targeted Google Ads that drive qualified leads/)
    ).toBeInTheDocument();
  });

  it('all pillars link to /services', () => {
    render(<Pillars />);
    const links = screen.getAllByRole('link');
    links.forEach((link) => {
      expect(link).toHaveAttribute('href', '/services');
    });
  });
});
