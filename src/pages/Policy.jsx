import React from 'react';
import { useParams, Link } from 'react-router-dom';

const companyInfo = {
  address: "10/481, Aravali Vihar, R.H.B. Colony, RIICO Industrial Area, Bhiwadi, Rajasthan - 301019",
  email: "SALES@ELEXOPLUS.IN",
  phone: "+91 9257061015",
  company: "ELEXO PLUS INDIA PVT LTD"
};

const policies = {
  shipping: {
    title: "📦 Shipping Policy",
    content: (
      <div className="space-y-4">
        <p>All orders are processed and shipped from our Bhiwadi facility within 1-2 business days (Monday to Friday).</p>
        <h3 className="text-xl font-semibold text-white">Delivery Estimates</h3>
        <p>Delivery typically takes 3-7 business days across India depending on the pincode. Tracking numbers will be activated within 24 hours of dispatch.</p>
        <h3 className="text-xl font-semibold text-white">Transit Damages</h3>
        <p>ELEXO PLUS is not liable for items lost in transit without inspection claims. If you received your shipment damaged, preserve all packaging boxes and contact customer care immediately.</p>
      </div>
    )
  },
  cancellation: {
    title: "🔄 Cancellations & Refunds Policy",
    content: (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Order Cancellation</h3>
        <p>Orders can be canceled prior to dispatch by emailing {companyInfo.email} or calling {companyInfo.phone}. Dispatched orders cannot be cancelled.</p>
        <h3 className="text-xl font-semibold text-white">7-Day Return Policy</h3>
        <p>We accept replacements and returns for defective appliances reported within 7 days of arrival. Returned goods must include all original manuals, barcodes, and accessories.</p>
        <h3 className="text-xl font-semibold text-white">Refund Processing</h3>
        <p>Approved refunds are reversed directly through Razorpay to the original payment source within 7-10 working days.</p>
      </div>
    )
  },
  privacy: {
    title: "🔒 Privacy Policy",
    content: (
      <div className="space-y-4">
        <p>ELEXO PLUS values consumer confidentiality. We collect standard order fulfillment details: customer name, shipping address, mobile number, and email address.</p>
        <h3 className="text-xl font-semibold text-white">Payment Security via Razorpay</h3>
        <p>All online transactions and advance bookings are secured via 256-bit SSL encryption provided by Razorpay. We do not store complete banking or card credentials on our servers.</p>
      </div>
    )
  },
  terms: {
    title: "📜 Terms & Conditions",
    content: (
      <div className="space-y-4">
        <p>By using this website, you agree to comply with Indian commercial laws subject to the judicial jurisdiction of Bhiwadi, Rajasthan.</p>
        <h3 className="text-xl font-semibold text-white">Intellectual Property</h3>
        <p>All trademark assets, diagrams, and brand iconography of ELEXO PLUS remain exclusive intellectual property under registered registration UDYAM-RJ-37-0005128.</p>
      </div>
    )
  }
};

export default function Policy() {
  const { policyType } = useParams();
  const current = policies[policyType];

  if (!current) {
    return (
      <div className="min-h-screen bg-black text-white pt-32 px-6 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Policies</h1>
        <ul className="space-y-3">
          {Object.keys(policies).map(key => (
            <li key={key}>
              <Link to={`/policy/${key}`} className="text-yellow-400 hover:underline text-lg">
                {policies[key].title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-300 pt-32 px-6 max-w-4xl mx-auto pb-20">
      <h1 className="text-4xl font-extrabold text-white mb-8 border-b border-gray-800 pb-4">{current.title}</h1>
      {current.content}
      <div className="mt-12 p-6 border-t border-gray-800 text-sm">
        <p><strong>Company:</strong> {companyInfo.company}</p>
        <p><strong>Address:</strong> {companyInfo.address}</p>
        <p><strong>Contact:</strong> {companyInfo.phone} | {companyInfo.email}</p>
      </div>
    </div>
  );
}
