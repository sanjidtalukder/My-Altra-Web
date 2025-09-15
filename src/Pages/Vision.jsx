import { useState, useEffect, useRef } from "react";

// Utility function for classNames
const cn = (...classes) => classes.filter(Boolean).join(" ");

// Timeline Component
const Timeline = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % timelineItems.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const timelineItems = [
    {
      title: "Hackathon Prototype",
      description: "Born from urgency and innovation",
      icon: "💡"
    },
    {
      title: "Pilot Deployment",
      description: "Tested in real-world urban stress zones",
      icon: "🏗️"
    },
    {
      title: "Multi-City Rollout",
      description: "Scaling across continents with local intelligence",
      icon: "🌍"
    }
  ];

  return (
    <div className="relative py-20 lg:py-32">
      {/* Dynamic timeline line with gradient */}
      <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-purple-500/40 via-blue-400/40 to-cyan-400/40 opacity-80 rounded-full">
        <div className="absolute top-0 w-full h-1/3 bg-gradient-to-b from-purple-500/50 to-transparent opacity-50 rounded-full animate-pulse" />
      </div>
      
      {/* Floating particles around timeline */}
      <div className="absolute left-1/2 top-1/4 transform -translate-x-1/2 w-3 h-3 bg-purple-500/30 rounded-full animate-float" />
      <div className="absolute left-1/2 top-2/3 transform -translate-x-1/2 w-2 h-2 bg-cyan-400/40 rounded-full animate-float" style={{animationDelay: '1s'}} />
      
      <div className="space-y-20 lg:space-y-32">
        {timelineItems.map((item, index) => (
          <div
            key={index}
            className={cn(
              "relative flex items-center transition-all duration-1000 transform",
              index % 2 === 0 ? "justify-start lg:pr-8" : "justify-end lg:pl-8"
            )}
          >
            {/* Enhanced timeline dot */}
            <div
              className={cn(
                "absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full border-4 transition-all duration-700 z-20",
                activeIndex >= index 
                  ? "bg-purple-500 border-cyan-400 shadow-lg shadow-cyan-400/50 scale-125" 
                  : "bg-gray-800 border-gray-600 scale-100 hover:scale-110"
              )}
            >
              {activeIndex >= index && (
                <div className="absolute inset-0 w-full h-full bg-purple-500/30 rounded-full animate-ping" />
              )}
            </div>
            
            {/* Enhanced content card */}
            <div
              className={cn(
                "group relative bg-gray-900/80 backdrop-blur-md p-8 lg:p-10 rounded-2xl shadow-xl border border-gray-700 max-w-lg transition-all duration-700 hover:shadow-cyan-400/20 hover:border-cyan-400/50",
                index % 2 === 0 ? "mr-4 lg:mr-12" : "ml-4 lg:ml-12",
                activeIndex >= index 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-70 scale-95 translate-y-4"
              )}
            >
              {/* Card background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-cyan-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-6 mb-6">
                  <span className="text-4xl lg:text-5xl group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </span>
                  <h3 className="text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 group-hover:from-purple-300 group-hover:to-cyan-300 transition-colors">
                    {item.title}
                  </h3>
                </div>
                <p className="text-lg lg:text-xl text-gray-300 leading-relaxed group-hover:text-gray-100 transition-colors">
                  {item.description}
                </p>
              </div>
              
              {/* Progress indicator */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-700/20 rounded-b-2xl overflow-hidden">
                <div 
                  className={cn(
                    "h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-1000",
                    activeIndex >= index ? "w-full" : "w-0"
                  )}
                />
              </div>
            </div>

            {/* Connecting lines */}
            <div 
              className={cn(
                "absolute top-1/2 w-20 lg:w-32 h-px bg-gradient-to-r from-purple-500 to-cyan-500 opacity-0 transition-all duration-700",
                index % 2 === 0 ? "right-8 lg:right-16" : "left-8 lg:left-16",
                activeIndex >= index ? "opacity-100 scale-x-100" : "scale-x-0"
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// PartnerGrid Component
const PartnerGrid = () => {
  const partners = [
    {
      name: "NASA",
      icon: "🛰️",
      description: "Earth data fusion and satellite intelligence",
      color: "from-blue-500/20 to-purple-500/20"
    },
    {
      name: "Local Agencies",
      icon: "🏛️",
      description: "Urban planning and hazard response coordination",
      color: "from-green-500/20 to-teal-500/20"
    },
    {
      name: "NGOs",
      icon: "🌱",
      description: "Community engagement and equity initiatives",
      color: "from-emerald-500/20 to-cyan-500/20"
    },
    {
      name: "Citizen Groups",
      icon: "👥",
      description: "Feedback loops and lived experience insights",
      color: "from-orange-500/20 to-red-500/20"
    }
  ];

  return (
    <section className="py-20 lg:py-32 relative">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
      </div>

      <div className="relative z-10">
        <div className="text-center mb-20">
          <h3 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-8">
            Our Collaborators
          </h3>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto mb-8 rounded-full" />
          <p className="text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Building urban resilience through strategic partnerships and shared expertise
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {partners.map((partner, index) => (
            <div
              key={partner.name}
              className={cn(
                "group relative bg-gray-900/60 backdrop-blur-md border border-gray-700 rounded-3xl p-8 lg:p-10",
                "hover:border-cyan-400/60 transition-all duration-700 hover:scale-105 hover:-rotate-1",
                "cursor-pointer"
              )}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Dynamic background gradient */}
              <div className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100",
                "transition-opacity duration-700 rounded-3xl",
                partner.color
              )} />
              
              {/* Floating icon container */}
              <div className="relative z-10 mb-8">
                <div className="relative inline-block">
                  <div className="text-5xl lg:text-6xl mb-6 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
                    {partner.icon}
                  </div>
                  {/* Icon glow effect */}
                  <div className="absolute inset-0 text-5xl lg:text-6xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-sm">
                    {partner.icon}
                  </div>
                </div>
              </div>
              
              <div className="relative z-10 space-y-4">
                <h4 className="text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 group-hover:from-purple-300 group-hover:to-cyan-300 transition-colors duration-500">
                  {partner.name}
                </h4>
                
                <p className="text-base lg:text-lg text-gray-300 group-hover:text-gray-100 transition-colors duration-500 leading-relaxed">
                  {partner.description}
                </p>
              </div>
              
              {/* Interactive border effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-20 transition-opacity duration-700" />
              <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-purple-500/30 to-cyan-500/30 opacity-0 group-hover:opacity-30 blur transition-opacity duration-700" />
              
              {/* Connection lines */}
              <div className="absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-700 hidden lg:block" />
            </div>
          ))}
        </div>

        {/* Partnership network visualization */}
        <div className="mt-20 flex justify-center">
          <div className="relative">
            <div className="text-center">
              <div className="inline-flex items-center gap-4 px-8 py-4 bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-full">
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
                <span className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Connected Network</span>
                <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ImpactTargets Component
const CountUp = ({ value, suffix, isVisible }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!isVisible) return;
    
    const target = parseInt(value);
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [isVisible, value]);
  
  return (
    <span className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
      {count}{suffix}
    </span>
  );
};

const ImpactTargets = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const impactStats = [
    {
      value: "30",
      suffix: "%",
      description: "reduction in urban heat exposure by 2030",
      icon: "🌡️"
    },
    {
      value: "100",
      suffix: "+",
      description: "cities equipped with predictive hazard dashboards",
      icon: "📊"
    },
    {
      value: "5",
      suffix: "M",
      description: "residents benefiting from improved walkability",
      icon: "🚶"
    }
  ];

  return (
    <section ref={sectionRef} className="py-24 lg:py-40 relative overflow-hidden">
      {/* Dynamic background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] bg-gradient-to-r from-purple-500/5 to-cyan-500/5 opacity-5 rounded-full blur-3xl animate-spin" style={{animationDuration: '120s'}} />
      </div>

      <div className="relative z-10 container mx-auto px-6 lg:px-8">
        <div className="text-center mb-24">
          <h3 className="text-5xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-10 tracking-tight">Impact Goals</h3>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto mb-10 rounded-full" />
          <p className="text-2xl lg:text-3xl text-gray-300 max-w-5xl mx-auto leading-relaxed font-light">
            Measurable outcomes that transform urban environments and protect vulnerable communities
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-20">
          {impactStats.map((stat, index) => (
            <div
              key={index}
              className={cn(
                "text-center group relative",
                "hover:scale-110 transition-all duration-700 hover:-rotate-1"
              )}
              style={{ animationDelay: `${index * 0.3}s` }}
            >
              {/* Card background */}
              <div className="relative bg-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-3xl p-12 lg:p-16 group-hover:border-cyan-400/50 transition-all duration-700">
                {/* Floating icon */}
                <div className="mb-10 relative">
                  <div className="text-6xl lg:text-8xl group-hover:animate-bounce transform group-hover:scale-125 transition-all duration-500">
                    {stat.icon}
                  </div>
                  {/* Icon shadow */}
                  <div className="absolute inset-0 text-6xl lg:text-8xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-sm">
                    {stat.icon}
                  </div>
                </div>
                
                {/* Counter display */}
                <div className="mb-8 overflow-hidden relative">
                  <div className="relative z-10">
                    <CountUp value={stat.value} suffix={stat.suffix} isVisible={isVisible} />
                  </div>
                  {/* Counter glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500">
                    <CountUp value={stat.value} suffix={stat.suffix} isVisible={isVisible} />
                  </div>
                </div>
                
                <p className="text-xl lg:text-2xl text-gray-300 max-w-sm mx-auto leading-relaxed group-hover:text-gray-100 transition-colors duration-500">
                  {stat.description}
                </p>
                
                {/* Progress indicator */}
                <div className="mt-10 h-2 bg-gray-700/20 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-2000 rounded-full",
                      isVisible ? "w-full" : "w-0"
                    )}
                    style={{ transitionDelay: `${index * 0.5}s` }}
                  />
                </div>

                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-10 transition-opacity duration-700" />
              </div>

              {/* Orbital elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-purple-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-cyan-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>

        {/* Connection visualization */}
        <div className="mt-24 flex justify-center items-center gap-8">
          <div className="w-32 h-px bg-gradient-to-r from-purple-500 to-cyan-500" />
          <div className="relative">
            <div className="w-6 h-6 bg-purple-500 rounded-full animate-pulse" />
            <div className="absolute inset-0 w-6 h-6 bg-purple-500/30 rounded-full animate-ping" />
          </div>
          <div className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Unified Impact</div>
          <div className="relative">
            <div className="w-6 h-6 bg-cyan-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}} />
            <div className="absolute inset-0 w-6 h-6 bg-cyan-500/30 rounded-full animate-ping" style={{animationDelay: '0.5s'}} />
          </div>
          <div className="w-32 h-px bg-gradient-to-r from-purple-500 to-cyan-500" />
        </div>
      </div>
    </section>
  );
};

// CallToAction Component
const CallToAction = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black opacity-20" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <h4 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-6">
          Join the Movement
        </h4>
        
        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
          Whether you're a planner, researcher, or citizen advocate—ASTRA is built for you. 
          Let's shape resilient cities together.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button 
            className={cn(
              "bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold px-8 py-4 text-lg rounded-lg",
              "border border-cyan-400/30 shadow-lg shadow-cyan-400/20 hover:shadow-cyan-400/40 transition-all duration-300",
              "hover:scale-105 transform"
            )}
          >
            Become a Partner
          </button>
          
          <button 
            className={cn(
              "border border-purple-400/50 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 hover:from-purple-300 hover:to-cyan-300 px-8 py-4 text-lg font-semibold rounded-lg",
              "backdrop-blur-sm hover:border-cyan-400 transition-all duration-300",
              "hover:scale-105 transform"
            )}
          >
            Explore the Platform
          </button>
        </div>
        
        <div className="mt-16 grid md:grid-cols-3 gap-8 text-sm text-gray-400">
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-cyan-400 rounded-full" />
            Open Source & Collaborative
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-purple-400 rounded-full" />
            Real-time Data Integration
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-purple-400 rounded-full" />
            Community-Driven Solutions
          </div>
        </div>
      </div>
    </section>
  );
};

// Main Vision Component
export const AstraVision = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white overflow-hidden relative">
      {/* Animated cosmic background */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Stars */}
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.7 + 0.3,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}
          />
        ))}
        
        {/* Large floating elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-float-slow" style={{animationDelay: '3s'}} />
        
        {/* Nebula effects */}
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-purple-500/15 rounded-full blur-3xl animate-pulse-slow transform rotate-45" />
        <div className="absolute bottom-0 left-0 w-[50rem] h-[30rem] bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '2s'}} />
        
        {/* Floating geometric elements */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400/40 rounded-full animate-float" />
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-cyan-400/60 rounded-full animate-float" style={{animationDelay: '1s'}} />
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-purple-400/30 rounded-full animate-float" style={{animationDelay: '2s'}} />
        <div className="absolute top-1/5 right-1/2 w-0.5 h-20 bg-gradient-to-b from-purple-400/20 to-transparent opacity-20 animate-pulse" />
        <div className="absolute bottom-1/4 left-1/2 w-32 h-0.5 bg-gradient-to-r from-purple-400/30 to-cyan-400/30 opacity-30 animate-pulse" style={{animationDelay: '1s'}} />
      </div>

      {/* Hero Section */}
      <section className="relative py-32 lg:py-40 overflow-hidden">
        {/* Dynamic background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/40 via-black/60 to-gray-900/40" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 opacity-10 rounded-full blur-2xl animate-spin-slow" />
        
        <div className="relative z-10 container mx-auto px-6 lg:px-8 text-center">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-12 bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent tracking-tight animate-gradient">
              Vision
            </h2>
            <div className="h-px bg-gradient-to-r from-purple-500 to-cyan-500 max-w-md mx-auto mb-8 animate-expand" />
            <h3 className="text-2xl md:text-4xl lg:text-5xl font-light mb-12 text-gray-300 animate-fade-in">
              The Journey Ahead
            </h3>
            
            <p className="text-xl md:text-2xl lg:text-3xl text-gray-400 max-w-5xl mx-auto leading-relaxed font-light animate-fade-in">
              From prototype to planetary impact: ASTRA's path to urban resilience
            </p>
            
            {/* Enhanced decorative elements */}
            <div className="mt-20 flex justify-center items-center gap-12 animate-fade-in">
              <div className="h-px bg-gradient-to-r from-purple-500 to-cyan-500 w-32 animate-expand" />
              <div className="relative">
                <div className="w-4 h-4 bg-purple-500 rounded-full animate-pulse" />
                <div className="absolute inset-0 w-4 h-4 bg-purple-500/30 rounded-full animate-ping" />
              </div>
              <div className="h-px bg-gradient-to-r from-purple-500 to-cyan-500 w-32 animate-expand" />
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900/50 to-black/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-4">Our Evolution</h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Tracing the transformation from innovative concept to global urban resilience platform
            </p>
          </div>
          <Timeline />
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <PartnerGrid />
        </div>
      </section>

      {/* Impact Targets Section */}
      <ImpactTargets />

      {/* Call to Action Section */}
      <div className="container mx-auto px-6">
        <CallToAction />
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes expand {
          0% { width: 0; opacity: 0; }
          100% { width: 100%; opacity: 1; }
        }
        @keyframes spin-slow {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 8s ease infinite;
        }
        .animate-expand {
          animation: expand 1.5s ease-out forwards;
        }
        .animate-spin-slow {
          animation: spin-slow 30s linear infinite;
        }
        .animate-fade-in {
          animation: fade-in 1.5s ease-out forwards;
        }
        .animate-pulse-slow {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default AstraVision;
