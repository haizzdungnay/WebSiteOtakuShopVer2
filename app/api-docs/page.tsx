'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

// Dynamic import để tránh SSR issues
const SwaggerUI = dynamic(() => import('swagger-ui-react'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-red mx-auto mb-4"></div>
                <p className="text-gray-600">Đang tải API Documentation...</p>
            </div>
        </div>
    ),
});

export default function ApiDocsPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-red mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải API Documentation...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold mb-2">OtakuShop API Documentation</h1>
                    <p className="text-gray-300">
                        Tài liệu API cho nền tảng thương mại điện tử OtakuShop
                    </p>
                    <div className="mt-4 flex gap-4 text-sm">
                        <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full">
                            Version 2.0.0
                        </span>
                        <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full">
                            OpenAPI 3.0.3
                        </span>
                    </div>
                </div>
            </div>

            {/* Swagger UI */}
            <div className="swagger-wrapper">
                <SwaggerUI
                    url="/api/docs"
                    docExpansion="list"
                    defaultModelsExpandDepth={-1}
                    persistAuthorization={true}
                />
            </div>

            {/* Custom Styles */}
            <style jsx global>{`
        .swagger-wrapper {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .swagger-ui .topbar {
          display: none;
        }
        
        .swagger-ui .info {
          margin: 20px 0;
        }
        
        .swagger-ui .info .title {
          color: #1f2937;
        }
        
        .swagger-ui .scheme-container {
          background: #f9fafb;
          padding: 15px;
          border-radius: 8px;
        }
        
        .swagger-ui .opblock-tag {
          border-bottom: 1px solid #e5e7eb;
        }
        
        .swagger-ui .opblock.opblock-get {
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.05);
        }
        
        .swagger-ui .opblock.opblock-post {
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.05);
        }
        
        .swagger-ui .opblock.opblock-put {
          border-color: #f59e0b;
          background: rgba(245, 158, 11, 0.05);
        }
        
        .swagger-ui .opblock.opblock-delete {
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.05);
        }
        
        .swagger-ui .opblock .opblock-summary-method {
          font-weight: 600;
          border-radius: 4px;
          min-width: 70px;
        }
        
        .swagger-ui .btn.execute {
          background-color: #ef4444;
          border-color: #ef4444;
        }
        
        .swagger-ui .btn.execute:hover {
          background-color: #dc2626;
        }
        
        .swagger-ui .model-box {
          background: #f9fafb;
        }
        
        .swagger-ui table tbody tr td:first-of-type {
          padding: 10px 0;
        }
        
        .swagger-ui .response-col_status {
          font-weight: 600;
        }
        
        .swagger-ui .responses-inner h4 {
          font-size: 14px;
          margin: 10px 0;
        }
        
        @media (max-width: 768px) {
          .swagger-wrapper {
            padding: 10px;
          }
          
          .swagger-ui .opblock .opblock-summary {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
        </div>
    );
}
