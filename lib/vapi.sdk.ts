/**
 * Vapi SDK Integration
 * 
 * This file initializes and exports the Vapi client for voice AI interactions
 * Used for conducting AI-powered mock interviews with voice capabilities
 */
import Vapi from '@vapi-ai/web';

// Initialize Vapi client with API token from environment variables
export const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN!);