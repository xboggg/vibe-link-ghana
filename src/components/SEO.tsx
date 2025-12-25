import { Helmet } from "react-helmet";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  noindex?: boolean;
}

const SEO = ({
  title = "VibeLink Ghana | Digital Event Invitations",
  description = "Ghana's premier digital invitation service. Create stunning interactive invitations for weddings, funerals, naming ceremonies, graduations & corporate events.",
  keywords = "digital invitations Ghana, wedding invitations Ghana, funeral programs Ghana, naming ceremony invitations, event invitations Accra",
  canonical,
  ogImage = "https://vibelink.com.gh/og-image.jpg",
  ogType = "website",
  noindex = false,
}: SEOProps) => {
  const fullTitle = title.includes("VibeLink") ? title : `${title} | VibeLink Ghana`;
  const siteUrl = "https://vibelink.com.gh";
  const canonicalUrl = canonical ? `${siteUrl}${canonical}` : undefined;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      
      {/* Twitter */}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default SEO;
