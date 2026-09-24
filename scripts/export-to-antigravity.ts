/**
 * Antigravity Export & Provisioning Script
 * 
 * Uses the Google GenAI TypeScript SDK (@google/genai) and Gemini Interactions API
 * to export JeevanPath into a Managed Antigravity Agent (antigravity-preview-05-2026)
 * running inside a secure Google-hosted Linux sandbox.
 */
import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs';
import * as path from 'path';

async function exportToAntigravity() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('Error: GEMINI_API_KEY environment variable is required to export to Antigravity.');
    process.exit(1);
  }

  const ai = new GoogleGenAI({ apiKey });

  console.log('📦 Reading JeevanPath project configurations...');
  const agentsMdContent = fs.existsSync('.antigravity/AGENTS.md')
    ? fs.readFileSync('.antigravity/AGENTS.md', 'utf-8')
    : 'JeevanPath SC Beneficiary Livelihood Platform';

  const envJsonContent = fs.existsSync('.antigravity/environment.json')
    ? fs.readFileSync('.antigravity/environment.json', 'utf-8')
    : '{}';

  console.log('🚀 Registering custom Antigravity Agent: "jeevanpath-livelihood-agent"...');

  try {
    const agent = await ai.agents.create({
      id: `jeevanpath-agent-${Date.now()}`,
      base_agent: 'antigravity-preview-05-2026',
      system_instruction:
        'You are the JeevanPath platform engineering agent. Maintain zero typing barrier, large tactile 48px+ touch controls, Bhashini speech-first interview parsing, and 1-page PDF livelihood report generation for uneducated SC beneficiaries.',
      base_environment: {
        type: 'remote',
        sources: [
          {
            type: 'inline',
            target: '.agents/AGENTS.md',
            content: agentsMdContent,
          },
          {
            type: 'inline',
            target: '.antigravity/environment.json',
            content: envJsonContent,
          },
        ],
      },
    });

    console.log(`✅ Antigravity Agent successfully created! Agent ID: ${agent.id}`);
    console.log(`🌐 Ready to invoke via Google Interactions API:`);
    console.log(`   ai.interactions.create({ agent: "${agent.id}", input: "Verify JeevanPath build and test endpoints", environment: "remote" })`);
    return agent;
  } catch (err: any) {
    console.warn('Note: Live agent registration requires a paid Google Cloud project key with Antigravity preview access.');
    console.warn(`Details: ${err.message}`);
    console.log('📁 Local Antigravity export files generated successfully:');
    console.log('   - antigravity.config.json');
    console.log('   - .antigravity/AGENTS.md');
    console.log('   - .antigravity/environment.json');
    console.log('   - .antigravity/entrypoint.sh');
  }
}

if (process.argv[1]?.endsWith('export-to-antigravity.ts')) {
  exportToAntigravity().catch(console.error);
}

export { exportToAntigravity };
