import React, { useState } from "react";
import {
  Phone,
  Mail,
  MessageSquare,
  Share2,
  MapPin,
  Building,
  User,
  Copy,
  Navigation,
} from "lucide-react";

function Contact() {
  const [copied, setCopied] = useState(false);

  // Contact information
  const contactInfo = {
    name: "Abhishek Aggarwal",
    title: "Managing Director",
    company: "Superb Technologies",
    address: [
      "258, Kurampur Mazri Manmohan Nagar",
      "Ambala City, Ambala - 134003",
      "Haryana, India",
    ],
    phone: "+919034815524",
    email: "info.superbengineers@gmail.com",
    sms: "+919034815524",
  };

  // Coordinates for the map (Ambala City, Haryana)
  const mapCoordinates = {
    lat: 30.3782,
    lng: 76.7767,
  };

  // Google Maps URL for directions
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapCoordinates.lat},${mapCoordinates.lng}`;

  // Handle copying contact info
  const handleCopyContact = () => {
    const textToCopy = `Superb Technologies\n${contactInfo.name} (${
      contactInfo.title
    })\n${contactInfo.address.join("\n")}\nPhone: ${
      contactInfo.phone
    }\nEmail: ${contactInfo.email}`;

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-white to-primary-50 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Get in <span className="text-primary-600">Touch</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Reach out to our team for inquiries, technical support, or
              partnership opportunities.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto mt-5 rounded-full"></div>
          </div>

          {/* Main Contact Card */}
          <div className="bg-white rounded-2xl border border-primary-100 overflow-hidden mb-8">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white p-3">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-lg font-bold flex items-center gap-3">
                    {contactInfo.name}
                  </h2>
                  <p className="text-primary-200 text-xs mt-1">
                    {contactInfo.title}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleCopyContact}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors duration-300 text-sm font-medium"
                  >
                    <Copy size={12} />
                    {copied ? "Copied!" : "Copy Details"}
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Section - Contact Details */}
                <div className="lg:w-2/3 space-y-6">
                  {/* Company Info */}
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl border border-primary-200">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-primary-100 to-secondary-100">
                      <Building className="text-primary-600" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-primary-800 mb-1">
                        {contactInfo.company}
                      </h3>
                      <div className="flex items-start gap-2 mt-2">
                        <MapPin className="text-primary-500 mt-1" size={18} />
                        <div className="text-gray-700">
                          {contactInfo.address.map((line, index) => (
                            <p key={index}>{line}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Methods */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Phone */}
                    <a
                      href={`tel:${contactInfo.phone}`}
                      className="group p-4 bg-gradient-to-r from-primary-50 to-white rounded-xl border border-primary-200 hover:border-primary-300 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-lg bg-gradient-to-r from-primary-100 to-primary-200 group-hover:from-primary-200 group-hover:to-primary-300 transition-all">
                          <Phone className="text-primary-600" size={22} />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Call Us</p>
                          <p className="text-sm font-bold text-primary-800">
                            {contactInfo.phone}
                          </p>
                        </div>
                      </div>
                    </a>

                    {/* Email */}
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="group p-4 bg-gradient-to-r from-secondary-50 to-white rounded-xl border border-secondary-200 hover:border-secondary-300 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-lg bg-gradient-to-r from-secondary-100 to-secondary-200 group-hover:from-secondary-200 group-hover:to-secondary-300 transition-all">
                          <Mail className="text-secondary-600" size={22} />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Email Us</p>
                          <p className="text-sm font-bold text-secondary-800">
                            {contactInfo.email}
                          </p>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Right Section - Quick Actions */}
                <div className="lg:w-1/3">
                  <div className="bg-gradient-to-br from-primary-50 to-white rounded-xl border border-primary-200 p-6 h-full">
                    <h3 className="text-lg font-bold text-primary-800 mb-4">
                      Quick Actions
                    </h3>
                    <div className="space-y-3">
                      <a
                        href={`tel:${contactInfo.phone}`}
                        className="block w-full px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg font-semibold text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2"
                      >
                        <Phone size={18} />
                        Call Now
                      </a>
                      <a
                        href={`mailto:${contactInfo.email}`}
                        className="block w-full px-4 py-3 bg-white border border-primary-300 text-primary-700 rounded-lg font-semibold text-center hover:bg-primary-50 transition-colors duration-300 flex items-center justify-center gap-2"
                      >
                        <Mail size={18} />
                        Send Email
                      </a>
                    </div>

                    {/* Hours & Support */}
                    <div className="mt-8 pt-6 border-t border-primary-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-sm font-medium text-primary-800">
                          Available Support
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">
                        Monday - Friday: 9:00 AM - 6:00 PM IST
                        <br />
                        Quick response within 24 hours
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="bg-white rounded-2xl border border-primary-100 overflow-hidden">
            <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white p-3">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-sm font-bold flex items-center gap-3">
                    <MapPin size={24} />
                    Visit Our Office
                  </h2>
                  <p className="text-primary-200 text-xs mt-1">
                    Find us easily with interactive directions
                  </p>
                </div>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex text-sm items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors duration-300 font-medium"
                >
                  <Navigation size={12} />
                  Get Directions
                </a>
              </div>
            </div>

            <div className="p-4 md:p-6">
              {/* Map Container */}
              <div className="rounded-xl overflow-hidden border border-primary-200 shadow-lg h-[400px] md:h-[450px]">
                {/* Google Maps Embed */}
                <iframe
                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3438.3963920873945!2d76.7741110762326!3d30.378195474739134!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390fbeaae0c75991%3A0x20afbf93be6ed6e7!2sAmbala%20City%2C%20Haryana!5e0!3m2!1sen!2sin!4v${Date.now()}!5m2!1sen!2sin`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Superb Technologies Location"
                  className="w-full h-full"
                ></iframe>
              </div>

              {/* Location Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-gradient-to-r from-primary-50 to-white p-4 rounded-xl border border-primary-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary-100">
                      <MapPin className="text-primary-600" size={20} />
                    </div>
                    <h3 className="font-bold text-primary-800">Address</h3>
                  </div>
                  <p className="text-sm text-gray-700">
                    {contactInfo.address.map((line, index) => (
                      <span key={index}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </p>
                </div>

                <div className="bg-gradient-to-r from-secondary-50 to-white p-4 rounded-xl border border-secondary-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-secondary-100">
                      <Navigation className="text-secondary-600" size={20} />
                    </div>
                    <h3 className="font-bold text-secondary-800">
                      Coordinates
                    </h3>
                  </div>
                  <p className="text-sm text-gray-700">
                    Latitude: {mapCoordinates.lat.toFixed(4)}
                    <br />
                    Longitude: {mapCoordinates.lng.toFixed(4)}
                  </p>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-white p-4 rounded-xl border border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-green-100">
                      <Building className="text-green-600" size={20} />
                    </div>
                    <h3 className="font-bold text-green-800">Landmark</h3>
                  </div>
                  <p className="text-sm text-gray-700">
                    Near Manmohan Nagar
                    <br />
                    Kurampur Mazri Area
                    <br />
                    Central Ambala City
                  </p>
                </div>
              </div>

              {/* Additional Map Actions */}
              <div className="flex flex-wrap gap-3 mt-6 justify-center">
                <a
                  href={`https://maps.app.goo.gl/?q=${mapCoordinates.lat},${mapCoordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-300 font-medium"
                >
                  <Navigation size={18} />
                  Open in Google Maps
                </a>
                <button
                  onClick={() => {
                    const mapUrl = `https://maps.google.com/?q=${contactInfo.address.join(
                      ", "
                    )}`;
                    navigator.clipboard.writeText(mapUrl);
                    alert("Map link copied to clipboard!");
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-300 font-medium"
                >
                  <Copy size={18} />
                  Copy Map Link
                </button>
                {/* <a
                  href={`https://www.waze.com/ul?ll=${mapCoordinates.lat},${mapCoordinates.lng}&navigate=yes`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300 font-medium"
                >
                  Submit Inquiry
                </a> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Contact;
