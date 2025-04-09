/**
 * HighLevel API Client
 * 
 * This module provides functions to interact with the HighLevel API for CRM integration.
 * It handles adding contacts, opportunities, and triggering automations.
 */

const HIGHLEVEL_API_KEY = process.env.HIGHLEVEL_API_KEY;
const HIGHLEVEL_LOCATION_ID = process.env.HIGHLEVEL_LOCATION_ID;
const HIGHLEVEL_API_URL = 'https://services.leadconnectorhq.com';

/**
 * Contact interface for HighLevel API
 */
interface HighLevelContact {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  name?: string;
  address1?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  companyName?: string;
  tags?: string[];
  source?: string;
  customField?: Record<string, string | number | boolean>;
}

/**
 * Opportunity interface for HighLevel API
 */
interface HighLevelOpportunity {
  name: string;
  pipelineId: string;
  stageId: string;
  status?: "open" | "won" | "lost";
  assignedTo?: string;
  monetaryValue?: number;
  contactId?: string;
  email?: string;
  phone?: string;
  source?: string;
  tags?: string[];
  customField?: Record<string, string | number | boolean>;
}

/**
 * Workflow interface for HighLevel API
 */
interface HighLevelWorkflow {
  workflowId: string;
  email?: string;
  phone?: string;
  contactId?: string;
}

/**
 * Create or update a contact in HighLevel
 */
export async function createContact(contact: HighLevelContact): Promise<any> {
  try {
    if (!HIGHLEVEL_API_KEY || !HIGHLEVEL_LOCATION_ID) {
      throw new Error("HighLevel API key or location ID not configured");
    }
    
    const response = await fetch(`${HIGHLEVEL_API_URL}/locations/${HIGHLEVEL_LOCATION_ID}/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HIGHLEVEL_API_KEY}`,
      },
      body: JSON.stringify(contact),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to create contact: ${errorData.message || response.statusText}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error creating contact in HighLevel:', error);
    throw error;
  }
}

/**
 * Get contact by email
 */
export async function getContactByEmail(email: string): Promise<any> {
  try {
    if (!HIGHLEVEL_API_KEY || !HIGHLEVEL_LOCATION_ID) {
      throw new Error("HighLevel API key or location ID not configured");
    }
    
    const response = await fetch(`${HIGHLEVEL_API_URL}/locations/${HIGHLEVEL_LOCATION_ID}/contacts/lookup?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${HIGHLEVEL_API_KEY}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null; // Contact not found
      }
      const errorData = await response.json();
      throw new Error(`Failed to get contact: ${errorData.message || response.statusText}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error retrieving contact from HighLevel:', error);
    throw error;
  }
}

/**
 * Add a tag to a contact in HighLevel
 */
export async function addTagToContact(contactId: string, tag: string): Promise<any> {
  try {
    if (!HIGHLEVEL_API_KEY || !HIGHLEVEL_LOCATION_ID) {
      throw new Error("HighLevel API key or location ID not configured");
    }
    
    const response = await fetch(`${HIGHLEVEL_API_URL}/locations/${HIGHLEVEL_LOCATION_ID}/contacts/${contactId}/tags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HIGHLEVEL_API_KEY}`,
      },
      body: JSON.stringify({ tags: [tag] }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to add tag: ${errorData.message || response.statusText}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error adding tag to contact in HighLevel:', error);
    throw error;
  }
}

/**
 * Create an opportunity in HighLevel
 */
export async function createOpportunity(opportunity: HighLevelOpportunity): Promise<any> {
  try {
    if (!HIGHLEVEL_API_KEY || !HIGHLEVEL_LOCATION_ID) {
      throw new Error("HighLevel API key or location ID not configured");
    }
    
    const response = await fetch(`${HIGHLEVEL_API_URL}/locations/${HIGHLEVEL_LOCATION_ID}/opportunities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HIGHLEVEL_API_KEY}`,
      },
      body: JSON.stringify(opportunity),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to create opportunity: ${errorData.message || response.statusText}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error creating opportunity in HighLevel:', error);
    throw error;
  }
}

/**
 * Update an opportunity in HighLevel
 */
export async function updateOpportunity(opportunityId: string, opportunity: Partial<HighLevelOpportunity>): Promise<any> {
  try {
    if (!HIGHLEVEL_API_KEY || !HIGHLEVEL_LOCATION_ID) {
      throw new Error("HighLevel API key or location ID not configured");
    }
    
    const response = await fetch(`${HIGHLEVEL_API_URL}/locations/${HIGHLEVEL_LOCATION_ID}/opportunities/${opportunityId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HIGHLEVEL_API_KEY}`,
      },
      body: JSON.stringify(opportunity),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to update opportunity: ${errorData.message || response.statusText}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error updating opportunity in HighLevel:', error);
    throw error;
  }
}

/**
 * Trigger a workflow in HighLevel
 */
export async function triggerWorkflow(workflow: HighLevelWorkflow): Promise<any> {
  try {
    if (!HIGHLEVEL_API_KEY || !HIGHLEVEL_LOCATION_ID) {
      throw new Error("HighLevel API key or location ID not configured");
    }
    
    const response = await fetch(`${HIGHLEVEL_API_URL}/locations/${HIGHLEVEL_LOCATION_ID}/workflows/${workflow.workflowId}/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HIGHLEVEL_API_KEY}`,
      },
      body: JSON.stringify({
        email: workflow.email,
        phone: workflow.phone,
        contactId: workflow.contactId
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to trigger workflow: ${errorData.message || response.statusText}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error triggering workflow in HighLevel:', error);
    throw error;
  }
}

/**
 * Get all pipelines from HighLevel
 */
export async function getPipelines(): Promise<any[]> {
  try {
    if (!HIGHLEVEL_API_KEY || !HIGHLEVEL_LOCATION_ID) {
      throw new Error("HighLevel API key or location ID not configured");
    }
    
    const response = await fetch(`${HIGHLEVEL_API_URL}/locations/${HIGHLEVEL_LOCATION_ID}/pipelines`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${HIGHLEVEL_API_KEY}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to get pipelines: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    return data.pipelines || [];
  } catch (error: any) {
    console.error('Error retrieving pipelines from HighLevel:', error);
    throw error;
  }
}

/**
 * Get pipeline stages from HighLevel
 */
export async function getPipelineStages(pipelineId: string): Promise<any[]> {
  try {
    if (!HIGHLEVEL_API_KEY || !HIGHLEVEL_LOCATION_ID) {
      throw new Error("HighLevel API key or location ID not configured");
    }
    
    const response = await fetch(`${HIGHLEVEL_API_URL}/locations/${HIGHLEVEL_LOCATION_ID}/pipelines/${pipelineId}/stages`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${HIGHLEVEL_API_KEY}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to get pipeline stages: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    return data.stages || [];
  } catch (error: any) {
    console.error('Error retrieving pipeline stages from HighLevel:', error);
    throw error;
  }
}

/**
 * Get all workflows from HighLevel
 */
export async function getWorkflows(): Promise<any[]> {
  try {
    if (!HIGHLEVEL_API_KEY || !HIGHLEVEL_LOCATION_ID) {
      throw new Error("HighLevel API key or location ID not configured");
    }
    
    const response = await fetch(`${HIGHLEVEL_API_URL}/locations/${HIGHLEVEL_LOCATION_ID}/workflows`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${HIGHLEVEL_API_KEY}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to get workflows: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    return data.workflows || [];
  } catch (error: any) {
    console.error('Error retrieving workflows from HighLevel:', error);
    throw error;
  }
} 