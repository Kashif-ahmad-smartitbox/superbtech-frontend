import React from "react";
import {
  Users,
  TrendingUp,
  Calendar,
  Globe,
  Shield,
  Award,
  Target,
  Eye,
  CheckCircle2,
} from "lucide-react";
import ScrollAnimatedItem from "./ScrollAnimatedItem";

const AboutSection = () => {
  const storyPoints = [
    {
      icon: Award,
      label: "Who We Are",
      text: (
        <>
          <strong className="text-primary-700">Superb Technologies</strong>,
          established in <strong className="text-primary-700">2015</strong>,
          is a professionally managed manufacturing firm engaged in the
          design, development, and supply of{" "}
          <strong className="text-primary-700">
            Scientific Laboratory Equipment
          </strong>
          . Since inception, the company has steadily built a reputation for
          quality, consistency, and dependable after-sales support.
        </>
      ),
    },
    {
      icon: Target,
      label: "What We Build",
      text: (
        <>
          Our manufacturing portfolio includes{" "}
          <strong className="text-primary-700">
            Chemical Engineering Lab Equipment, Heat Transfer and Mass
            Transfer Systems, Fluid Mechanics Lab Equipment, and Fluid
            Machinery Test Rigs
          </strong>
          . These systems are engineered to meet academic curriculum
          requirements and practical training standards followed by
          technical institutes and universities.
        </>
      ),
    },
    {
      icon: Shield,
      label: "Engineering Focus",
      text: (
        <>
          Every product is developed with a focus on{" "}
          <strong className="text-primary-700">
            mechanical robustness, operational simplicity, measurement
            accuracy, and long service life
          </strong>
          . This approach has enabled us to serve engineering colleges,
          research institutions, polytechnics, and industrial training
          centers across India and abroad.
        </>
      ),
    },
    {
      icon: CheckCircle2,
      label: "Quality At Every Stage",
      text: (
        <>
          Backed by an experienced engineering and quality team, we follow
          strict quality control practices at every stage—from raw material
          selection to final testing—ensuring consistent performance and
          long-term reliability in real-world lab environments.
        </>
      ),
    },
  ];

  const stats = [
    {
      icon: Users,
      value: "11–25",
      label: "Skilled Professionals",
      from: "from-blue-500",
      to: "to-cyan-400",
      iconColor: "text-blue-500",
    },
    {
      icon: TrendingUp,
      value: "₹5–25 Cr",
      label: "Annual Turnover",
      from: "from-emerald-500",
      to: "to-teal-400",
      iconColor: "text-emerald-500",
    },
    {
      icon: Calendar,
      value: "2015",
      label: "Year of Establishment",
      from: "from-purple-500",
      to: "to-pink-400",
      iconColor: "text-purple-500",
    },
    {
      icon: Globe,
      value: "IEC",
      label: "Export Enabled",
      from: "from-orange-500",
      to: "to-amber-400",
      iconColor: "text-orange-500",
    },
  ];

  const trustPoints = [
    "IndiaMART Trust Seal Verified Supplier",
    "IndiaMART Verified Exporter",
    "GST Registered Partnership Firm",
    "Consistent Supplier to Educational Institutions",
  ];

  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-b from-white to-primary-50 overflow-hidden">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatSlow {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(12px, -18px); }
        }
        @keyframes growBar {
          from { width: 0; }
          to { width: 6rem; }
        }
        .animate-fade-up { animation: fadeUp .7s cubic-bezier(.16,1,.3,1) both; }
        .animate-float-slow { animation: floatSlow 9s ease-in-out infinite; }
        .animate-grow-bar { animation: growBar .8s .3s cubic-bezier(.16,1,.3,1) both; }
        .shine-sweep { position: relative; overflow: hidden; }
        .shine-sweep::after {
          content: "";
          position: absolute;
          top: 0; left: 0;
          width: 45%; height: 100%;
          background: linear-gradient(115deg, transparent, rgba(255,255,255,.5), transparent);
          transform: translateX(-140%) skewX(-12deg);
          transition: transform .85s ease;
          pointer-events: none;
        }
        .shine-sweep:hover::after { transform: translateX(260%) skewX(-12deg); }
        @media (prefers-reduced-motion: reduce) {
          .animate-fade-up, .animate-float-slow, .animate-grow-bar { animation: none !important; }
          .shine-sweep::after { display: none !important; }
        }
      `}</style>

      <div className="container mx-auto px-4 max-w-7xl relative">
        {/* Header */}
        <div className="text-center mb-14 animate-fade-up">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 bg-white rounded-full border border-primary-200 shadow-sm">
            <Award className="w-4 h-4 text-secondary-500" />
            <span className="text-xs font-bold tracking-wide uppercase text-primary-700">
              Trusted Manufacturer Since 2015
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            About{" "}
            <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              Superb Technologies
            </span>
          </h2>
          <p className="mt-4 text-gray-600 max-w-3xl mx-auto text-base md:text-lg">
            A trusted Indian manufacturer delivering reliable scientific and
            engineering laboratory equipment for academic and industrial
            applications.
          </p>
          <div className="h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto mt-5 rounded-full animate-grow-bar" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
          {/* Left Content — Story spine */}
          <div>
            {storyPoints.map((point, index) => {
              const Icon = point.icon;
              const isLast = index === storyPoints.length - 1;
              return (
                <ScrollAnimatedItem
                  key={point.label}
                  className={`relative pl-14 ${isLast ? "" : "pb-8"}`}
                  delay={index * 0.1}
                >
                  {!isLast && (
                    <span className="absolute left-[19px] top-11 bottom-0 w-px bg-gradient-to-b from-primary-200 to-transparent" />
                  )}
                  <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-md ring-4 ring-white z-10">
                    <Icon className="text-white" size={18} />
                  </div>
                  <div className="text-xs font-bold tracking-wide uppercase text-primary-500 mb-1.5 pt-1.5">
                    {point.label}
                  </div>
                  <p className="text-gray-700 leading-relaxed text-[15px] md:text-base">
                    {point.text}
                  </p>
                </ScrollAnimatedItem>
              );
            })}
          </div>

          {/* Right Stats & Trust */}
          <div className="space-y-8">
            {/* Key Facts with Icons */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="relative overflow-hidden group animate-fade-up border border-primary-200 rounded-2xl p-6 text-center bg-white/70 backdrop-blur-xl transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2 cursor-pointer z-10"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Hover background shine */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                    
                    <div className="relative mx-auto w-16 h-16 mb-5 group-hover:-translate-y-1 transition-all duration-500 transform-gpu perspective-1000">
                      {/* 3D Glowing shadow layer behind the icon box */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${stat.from} ${stat.to} rounded-2xl blur-xl opacity-30 group-hover:opacity-60 transition-all duration-500 group-hover:scale-110`} />
                      
                      {/* 3D Bevel Box for Icon */}
                      <div className={`relative flex items-center justify-center w-full h-full rounded-2xl bg-white border border-white shadow-[0_8px_16px_rgba(0,0,0,0.06),inset_0_4px_8px_rgba(255,255,255,1),inset_0_-4px_8px_rgba(0,0,0,0.04)] group-hover:shadow-[0_12px_24px_rgba(0,0,0,0.12),inset_0_6px_12px_rgba(255,255,255,1),inset_0_-4px_8px_rgba(0,0,0,0.06)] transition-all duration-500 group-hover:scale-110 transform-gpu group-hover:rotate-x-12 group-hover:rotate-y-12`}>
                        <Icon className={`${stat.iconColor} filter drop-shadow-[0_4px_4px_rgba(0,0,0,0.15)] group-hover:rotate-12 transition-transform duration-500`} size={28} strokeWidth={2.5} />
                      </div>
                    </div>
                    
                    <div className="text-2xl font-bold bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-500 inline-block">
                      {stat.value}
                    </div>
                    <div className="mt-1.5 text-sm font-semibold text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Trust & Compliance */}
            <div className="animate-fade-up border border-primary-200 rounded-xl p-6 bg-gradient-to-br from-primary-50 to-secondary-50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center shadow-sm">
                  <Shield className="text-white" size={20} />
                </div>
                <h4 className="font-bold text-primary-800 text-lg">
                  Trust, Compliance & Recognition
                </h4>
              </div>
              <ul className="text-sm text-gray-700 space-y-2.5">
                {trustPoints.map((item, index) => (
                  <li
                    key={item}
                    className="flex items-center gap-2.5 group/item hover:translate-x-1 transition-transform duration-300"
                  >
                    <CheckCircle2
                      className="w-4 h-4 text-secondary-500 flex-shrink-0 group-hover/item:text-secondary-600"
                      strokeWidth={2.5}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Closing Statement + Mission/Vision */}
        <div className="mt-16 text-center">
          <div className="max-w-4xl mx-auto">
            <p className="animate-fade-up text-gray-700 leading-relaxed text-[15px] md:text-base mb-10">
              At{" "}
              <strong className="text-primary-700">Superb Technologies</strong>,
              we believe long-term success is built on product reliability,
              ethical business practices, and customer satisfaction. Our goal is
              to support education and research by delivering laboratory
              equipment that performs consistently over time, adds real
              instructional value, and meets the evolving needs of engineering
              and scientific institutions.
            </p>

            {/* Mission/Vision Box */}
            <div className="animate-fade-up p-6 md:p-8 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl border border-primary-200 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                {/* Mission */}
                <div className="group relative overflow-hidden p-6 bg-white rounded-xl border border-primary-100 shadow-sm hover:shadow-md transition-shadow duration-300 text-left">
                  <Target className="absolute -right-4 -bottom-4 w-24 h-24 text-primary-50 group-hover:text-primary-100 transition-colors duration-500" />
                  <div className="relative flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center flex-shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                      <Target className="text-white" size={24} />
                    </div>
                    <h4 className="font-bold text-primary-800 text-xl">
                      Our Mission
                    </h4>
                  </div>
                  <p className="relative text-gray-700 text-sm leading-relaxed">
                    To provide high-quality, reliable laboratory equipment that
                    enhances technical education and industrial research
                    capabilities.
                  </p>
                </div>

                {/* Vision */}
                <div className="group relative overflow-hidden p-6 bg-white rounded-xl border border-primary-100 shadow-sm hover:shadow-md transition-shadow duration-300 text-left">
                  <Eye className="absolute -right-4 -bottom-4 w-24 h-24 text-secondary-50 group-hover:text-secondary-100 transition-colors duration-500" />
                  <div className="relative flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-secondary-500 to-secondary-600 flex items-center justify-center flex-shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                      <Eye className="text-white" size={24} />
                    </div>
                    <h4 className="font-bold text-primary-800 text-xl">
                      Our Vision
                    </h4>
                  </div>
                  <p className="relative text-gray-700 text-sm leading-relaxed">
                    To become the most trusted manufacturer of scientific
                    equipment in India, recognized for excellence in quality and
                    innovation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100 rounded-full -translate-y-32 translate-x-32 opacity-20 blur-3xl animate-float-slow" />
        <div
          className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-100 rounded-full translate-y-32 -translate-x-32 opacity-20 blur-3xl animate-float-slow"
          style={{ animationDelay: "3s" }}
        />
      </div>
    </section>
  );
};

export default AboutSection;

