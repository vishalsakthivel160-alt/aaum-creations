import React, { useState } from 'react';
import {
  ExternalLink,
  MessageCircle,
  Sparkles,
  ShieldCheck,
  HeartHandshake,
  Languages,
  ArrowRight,
  Leaf,
  CheckCircle2,
  Coffee,
  Sun,
  Package,
  ShoppingBag,
} from 'lucide-react';
import WhatsAppButton from './WhatsAppButton';
import businessKnowledge from '../data/businessKnowledge.json';

export default function StoreShowcase({ onAskAI }) {
  const { business, products } = businessKnowledge;
  const soursopProduct = products[0];

  const images = soursopProduct?.images || [
    { url: '/assets/soursop-box.jpg', title: 'Official Box Packaging', alt: 'Aaum Creations Soursop Leaves Box' },
    { url: '/assets/soursop-dried.jpg', title: 'Shadow Dried Leaves', alt: 'Shadow dried leaves' },
    { url: '/assets/soursop-fresh-leaves.jpg', title: 'Fresh Leaves on Tree', alt: 'Fresh leaves on tree' },
    { url: '/assets/soursop-fruit.jpg', title: 'Soursop Fruit', alt: 'Soursop fruit on branch' },
  ];

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  return (
    <div className="store-container">
      {/* Top Announcement Bar */}
      <div className="announcement-bar">
        <div className="announcement-content">
          <span className="announcement-badge">Official Store</span>
          <span>
            Authentic 100% Shadow-Dried Soursop Leaves (Graviola / முள்சீத்தா இலைகள்)
          </span>
          <span className="announcement-flipkart">
            Buy securely on{' '}
            <a
              href="https://dl.flipkart.com/s/dL!4cJuuuN"
              target="_blank"
              rel="noopener noreferrer"
              className="announcement-link"
            >
              Flipkart <ExternalLink size={12} className="inline-icon" />
            </a>
          </span>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="store-nav">
        <div className="nav-container">
          <div className="nav-brand">
            <div className="brand-logo-circle">
              <Leaf size={22} className="brand-logo-leaf" />
            </div>
            <div className="brand-titles">
              <h1 className="brand-main-title">{business.name}</h1>
              <p className="brand-tagline">{business.tagline}</p>
            </div>
          </div>

          <nav className="nav-actions">
            <a href="#product-showcase" className="nav-link">
              Product Details
            </a>
            <a href="#brewing-guide" className="nav-link">
              Brewing Guide
            </a>
            <a href="#about-section" className="nav-link">
              Why Shadow Dried?
            </a>
            <WhatsAppButton variant="compact" className="nav-whatsapp-btn">
              Chat on WhatsApp
            </WhatsAppButton>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="store-hero">
        <div className="hero-content">
          <div className="hero-tag">
            <Sparkles size={14} />
            <span>100% Pure • Shadow Dried • Pesticide-Free</span>
          </div>
          <h2 className="hero-heading">
            Authentic Shadow-Dried <br />
            Soursop Leaves (Graviola)
          </h2>
          <p className="hero-subtext">
            Handpicked with care and naturally dried in the shade to preserve raw botanical integrity,
            rich color, and natural aroma. Traditional herbal tea infusion by{' '}
            <strong>Aaum Creations</strong>.
          </p>

          <div className="hero-cta-group">
            <a
              href="https://dl.flipkart.com/s/dL!4cJuuuN"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-primary-btn hero-flipkart-btn"
            >
              <ShoppingBag size={18} />
              <span>Buy on Flipkart</span>
              <ExternalLink size={15} />
            </a>

            <WhatsAppButton
              variant="default"
              customMessage="Hello Aaum Creations! 🌿\nI would like to order authentic Shadow-Dried Soursop Leaves via direct Courier delivery.\n\n• Name: \n• Quantity (Packs): \n• Delivery Address: \n• Pincode: \n• Phone: \n\nPlease share payment details (UPI/GPay) to confirm my order!"
              className="hero-whatsapp-btn"
            >
              Order on WhatsApp (Courier)
            </WhatsAppButton>

            <button
              type="button"
              className="hero-secondary-btn"
              onClick={() => onAskAI('What are the two ways to order Soursop Leaves (Flipkart and WhatsApp Courier)?')}
            >
              <Sparkles size={16} />
              <span>Ask AI</span>
            </button>
          </div>

          {/* Quick Highlights */}
          <div className="hero-highlights">
            <div className="highlight-item">
              <CheckCircle2 size={16} className="highlight-icon" />
              <span>Shadow Dried (நிழலில் உலர்த்தப்பட்டது)</span>
            </div>
            <div className="highlight-item">
              <CheckCircle2 size={16} className="highlight-icon" />
              <span>Official Flipkart Listing</span>
            </div>
            <div className="highlight-item">
              <CheckCircle2 size={16} className="highlight-icon" />
              <span>Tamil & English AI Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Single Product Showcase with Gallery */}
      <section id="product-showcase" className="products-section">
        <div className="product-spotlight-container">
          {/* Gallery View */}
          <div className="gallery-column">
            <div className="main-image-viewport">
              <img
                src={images[activeImageIndex].url}
                alt={images[activeImageIndex].alt}
                className="spotlight-main-img"
              />
              <span className="gallery-badge">{images[activeImageIndex].title}</span>
            </div>

            {/* Thumbnail Navigation */}
            <div className="gallery-thumbnails" role="tablist" aria-label="Product image gallery">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  role="tab"
                  aria-selected={activeImageIndex === idx}
                  className={`gallery-thumb-btn ${activeImageIndex === idx ? 'active' : ''}`}
                  onClick={() => setActiveImageIndex(idx)}
                >
                  <img src={img.url} alt={img.title} className="thumb-img" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details Info */}
          <div className="spotlight-info-column">
            <div className="product-title-group">
              <span className="section-eyebrow">Pure Botanical Infusion</span>
              <h3 className="spotlight-title">{soursopProduct.name}</h3>
              <span className="spotlight-tamil-title">{soursopProduct.tamilName}</span>
            </div>

            <p className="spotlight-desc">{soursopProduct.description}</p>

            {/* Feature Bullets */}
            <div className="product-feature-list">
              <div className="feature-bullet">
                <Sun size={18} className="feature-icon" />
                <div>
                  <strong>Traditional Shadow-Drying:</strong>
                  <p>Leaves are gently dried in ambient shade, shielding them from UV heat damage to retain chlorophyll and raw vitality.</p>
                </div>
              </div>

              <div className="feature-bullet">
                <Package size={18} className="feature-icon" />
                <div>
                  <strong>Protective Box Packaging:</strong>
                  <p>Specially packaged in the Aaum Creations corrugated box to prevent leaf crushing and retain aroma.</p>
                </div>
              </div>

              <div className="feature-bullet">
                <Coffee size={18} className="feature-icon" />
                <div>
                  <strong>Simple Herbal Preparation:</strong>
                  <p>Brew 3-5 leaves in 2-3 cups of boiling water for 10-15 minutes. Strain and sip warm.</p>
                </div>
              </div>
            </div>

            {/* Compliance Disclaimer Box */}
            <div className="product-disclaimer-box">
              <strong>Honest Botanical Notice:</strong> {soursopProduct.importantDisclaimer}
            </div>

            {/* Action Buttons with 2 Order Pathways */}
            <div className="order-pathways-card">
              <div className="order-pathways-header">
                <span className="order-pathway-tag">
                  <Package size={14} /> 2 Ways to Order
                </span>
                <span className="order-pathway-desc">Direct Courier Delivery via WhatsApp or Official Flipkart Listing</span>
              </div>

              <div className="spotlight-actions">
                <a
                  href={soursopProduct.verifiedPurchaseLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-flipkart-buy"
                >
                  <ShoppingBag size={18} />
                  <span>Buy on Flipkart</span>
                  <ExternalLink size={15} />
                </a>

                <WhatsAppButton
                  customMessage={
                    soursopProduct.whatsappCourierOrder?.messageTemplate ||
                    "Hello Aaum Creations! 🌿\nI would like to order authentic Shadow-Dried Soursop Leaves via direct Courier delivery.\n\n• Name: \n• Quantity (Packs): \n• Delivery Address: \n• Pincode: \n• Phone: \n\nPlease share payment details (UPI/GPay) to confirm my order!"
                  }
                  className="btn-whatsapp-order"
                >
                  Order on WhatsApp (Courier)
                </WhatsAppButton>

                <button
                  type="button"
                  className="btn-ask-ai"
                  onClick={() => onAskAI('How can I order Soursop leaves via Flipkart or WhatsApp courier delivery?')}
                >
                  <Sparkles size={16} />
                  <span>Ask AI</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Traditional Brewing Guide */}
      <section id="brewing-guide" className="brewing-section">
        <div className="brewing-container">
          <div className="section-header">
            <span className="section-eyebrow">Traditional Preparation</span>
            <h3 className="section-title">How to Brew Soursop Leaf Tea</h3>
            <p className="section-description">
              Follow these simple steps to make a soothing, warm herbal botanical infusion.
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h4>Rinse Gently</h4>
              <p>Take 3 to 5 dried leaves from the Aaum Creations box and lightly rinse them with clean water to remove ambient dust.</p>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <h4>Boil on Medium Flame</h4>
              <p>Add the leaves to 2–3 cups of clean drinking water in a stainless steel or clay pot. Bring to a boil, then simmer for 10–15 minutes.</p>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <h4>Strain & Enjoy</h4>
              <p>Strain the golden tea into your cup. Sip warm. You can optionally add a few drops of lemon juice or natural honey to taste.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Values / Why Shadow Drying */}
      <section id="about-section" className="values-section">
        <div className="values-grid">
          <div className="value-card">
            <div className="value-icon-circle">
              <ShieldCheck size={24} />
            </div>
            <h4>Authentic Shadow Drying</h4>
            <p>
              Direct sun-basking bleaches leaves and damages volatile compounds. We patiently shadow-dry every leaf batch under hygienic, airy shelter.
            </p>
          </div>

          <div className="value-card">
            <div className="value-icon-circle">
              <HeartHandshake size={24} />
            </div>
            <h4>Pure & Transparent</h4>
            <p>
              We pride ourselves on zero exaggerated claims and zero synthetic preservatives. What you get is 100% pure Annona muricata leaves.
            </p>
          </div>

          <div className="value-card">
            <div className="value-icon-circle">
              <Languages size={24} />
            </div>
            <h4>English & தமிழ் Support</h4>
            <p>
              Our chatbot and team assist you seamlessly in both English and Tamil (தமிழ்) for product questions, brewing tips, and ordering.
            </p>
          </div>
        </div>
      </section>

      {/* Store Footer */}
      <footer className="store-footer">
        <div className="footer-content">
          <div className="footer-col brand-col">
            <div className="footer-brand">
              <Leaf size={20} className="brand-logo-leaf" />
              <span className="footer-brand-title">{business.name}</span>
            </div>
            <p className="footer-brand-desc">{business.description}</p>
          </div>

          <div className="footer-col contact-col">
            <h5>Direct Support</h5>
            <p>
              <strong>Hours:</strong> {business.contact.supportHours}
            </p>
            <p>
              <strong>WhatsApp:</strong>{' '}
              <a
                href="https://wa.me/917094556516"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
              >
                +91 70945 56516
              </a>
            </p>
            <p>
              <strong>Flipkart Store:</strong>{' '}
              <a
                href="https://dl.flipkart.com/s/dL!4cJuuuN"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
              >
                Official Soursop Leaves Listing
              </a>
            </p>
            <div className="footer-whatsapp-wrapper">
              <WhatsAppButton variant="default">Message Owner on WhatsApp</WhatsAppButton>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} {business.name}. All rights reserved.</p>
          <p className="footer-compliance">
            Disclaimer: Traditional botanicals are sold for general herbal tea infusions. Not
            evaluated to diagnose, treat, cure, or prevent any medical disease.
          </p>
        </div>
      </footer>
    </div>
  );
}
