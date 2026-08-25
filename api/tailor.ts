import type { VercelRequest, VercelResponse } from "@vercel/node";

interface TailorRequest {
  jobDescription: string;
  skills: string;
  experience: string;
}

interface TailorSuccess {
  coverLetter: string;
}

interface TailorError {
  error: string;
}

type TailorResponse = TailorSuccess | TailorError;

export default async function handler(
  req: VercelRequest,
  res: VercelResponse<TailorResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { jobDescription, skills, experience } = req.body as TailorRequest;

  if (!jobDescription?.trim()) {
    return res.status(400).json({ error: "Missing job description" });
  }

  try {
    const prompt = `Write a concise, professional cover letter tailored to the job description below, using the candidate's background. Keep it under 300 words, no placeholders like [Company Name] — write it naturally as if ready to send.

Job description:
${jobDescription}

Candidate's skills:
${skills || "Not provided"}

Candidate's experience:
${experience || "Not provided"}`;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY as string,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await geminiResponse.json();
    const coverLetter = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!coverLetter) {
      return res.status(500).json({ error: "No response generated" });
    }

    return res.status(200).json({ coverLetter });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to generate cover letter" });
  }
}