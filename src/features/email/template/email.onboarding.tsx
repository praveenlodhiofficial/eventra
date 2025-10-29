import config from "@/lib/config";
import {
   Body,
   Button,
   Container,
   Head,
   Hr,
   Html,
   Img,
   Preview,
   Section,
   Text,
} from "@react-email/components";

interface OnboardingEmailProps {
   name: string;
   ctaUrl?: string;
}

// Use production URL for visible links in emails to avoid showing localhost or preview URLs
const prodUrl = config.env.prodApiEndpoint || config.env.siteUrl;
const prodHost = (() => {
   try {
      return new URL(prodUrl).host;
   } catch {
      return prodUrl.replace(/^https?:\/\//, "");
   }
})();

export const OnboardingEmail = ({ name }: OnboardingEmailProps) => (
   <Html>
      <Head />
      <Body style={main}>
         <Preview>Discover and host unforgettable experiences with Eventra.</Preview>
         <Container style={container}>
            <Img
               src={`${prodUrl}/icon/logo3.png`}
               width="170"
               height="50"
               alt="Eventra"
               style={logo}
            />
            <Text style={paragraph}>Hi {name},</Text>
            <Text style={paragraph}>
               Welcome to <strong>Eventra</strong> — your place to discover amazing events, sell
               tickets, and grow your community. We&apos;re excited to have you on board!
            </Text>
            <Section style={btnContainer}>
               <Button style={button} href={`${prodUrl}/events`}>
                  Explore events
               </Button>
            </Section>
            {/* <Text style={paragraph}>
          Need help getting started? Just reply to this email — our team is here to help.
        </Text> */}
            <Hr style={hr} />
            <Text style={footer}>
               Eventra • All rights reserved
               <br />
               <a href={`${prodUrl}`} style={{ color: "#5F51E8", textDecoration: "none" }}>
                  {prodHost}
               </a>{" "}
               • Support: support@{prodHost}
            </Text>
         </Container>
      </Body>
   </Html>
);

OnboardingEmail.PreviewProps = {
   name: "Praveen",
} as OnboardingEmailProps;

export default OnboardingEmail;

const main = {
   backgroundColor: "#ffffff",
   fontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
   margin: "0 auto",
   padding: "20px 0 48px",
};

const logo = {
   margin: "0 auto",
};

const paragraph = {
   fontSize: "16px",
   lineHeight: "26px",
};

const btnContainer = {
   textAlign: "center" as const,
};

const button = {
   backgroundColor: "#5F51E8",
   borderRadius: "6px",
   color: "#fff",
   fontSize: "16px",
   textDecoration: "none",
   textAlign: "center" as const,
   display: "block",
   padding: "12px 16px",
};

const hr = {
   borderColor: "#cccccc",
   margin: "20px 0",
};

const footer = {
   color: "#8898aa",
   fontSize: "12px",
};
