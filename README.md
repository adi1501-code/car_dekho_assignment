# What did you build and why?

I built an AI-assisted car recommendation platform that helps users discover the best-fit car based on budget, driving usage, and purchase priorities.

Users can:

- filter cars based on hard constraints like budget, body type, fuel type, and transmission
- receive a primary recommended car along with alternative options
- get an AI-generated recommendation summary explaining why the car is a good fit

The system combines:

- deterministic filtering
- heuristic scoring/ranking
- AI-generated recommendation reasoning

The goal was to build a practical recommendation workflow instead of a generic searchable car listing.

The recommendation engine itself remains deterministic and explainable, while the LLM layer is used for contextual explanation and personalization.

---

# What did you deliberately cut?

I intentionally avoided overengineering the system.

Things I deliberately did not implement:

- conversational chatbot workflows
- vector databases / embeddings
- RAG pipelines
- collaborative filtering / ML recommendation models
- advanced analytics dashboards
- excessive frontend animations
- overly detailed automotive specifications
- microservice architecture
- complex deployment infrastructure

I also intentionally avoided building a fully authenticated multi-user system within the assignment timeline. Instead, I used browser-based session IDs stored in localStorage to persist recommendation history per browser session.

I chose to focus on:

- recommendation quality
- architecture clarity
- explainability
- end-to-end usability
- fast iteration

The assignment emphasized engineering process and AI-assisted development more than production-scale complexity.

---

# What's your tech stack and why did you pick it?

## Frontend

- React + Vite
- Tailwind CSS

**Reason:**

- fast iteration speed
- lightweight setup
- component-based UI
- easy responsive design
- minimal configuration overhead

## Backend

- FastAPI
- SQLAlchemy

**Reason:**

- clean API development
- strong request validation with Pydantic
- fast development workflow
- excellent developer experience

## Database

- SQLite

**Reason:**

- simple setup
- lightweight persistence
- ideal for assignment scope
- easy reproducibility through seed scripts

## AI Layer

- Gemini API

**Reason:**

- lightweight integration
- fast response generation
- sufficient for concise recommendation explanations

## Deployment

- Vercel (frontend)
- Render (backend)

**Reason:**

- quick deployment workflow
- minimal DevOps overhead
- easy reviewer accessibility

---

# What did you delegate to AI tools vs. do manually? Where did the tools help most?

I used AI tools primarily as implementation accelerators rather than architectural decision-makers.

**I manually designed:**

- overall architecture
- recommendation pipeline
- filtering strategy
- API structure
- database schema
- frontend/backend flow
- AI integration boundaries

**I used AI tools for:**

- UI scaffolding
- repetitive boilerplate
- ORM model scaffolding
- Tailwind styling generation
- synthetic dataset generation
- heuristic scoring logic iteration
- recommendation summary generation

The scoring logic itself was AI-assisted, but I simplified and adjusted the generated logic to keep the recommendation behavior explainable and appropriate for MVP scope.

**AI tools helped most with:**

- accelerating repetitive implementation
- generating frontend layouts quickly
- reducing boilerplate work
- iterating on UI structure
- rapidly prototyping backend logic

---

# Where did the tools get in the way?

The biggest issue with AI-generated code was overengineering.

Tools frequently generated:

- unnecessarily complex scoring logic
- excessive abstraction layers
- premature optimization
- mathematically complicated recommendation formulas
- bloated frontend structures

I often simplified generated code to keep the system:

- readable
- explainable
- maintainable
- appropriate for assignment scope

Another challenge was that AI-generated recommendation logic sometimes appeared sophisticated mathematically but produced less intuitive recommendation behavior.

The most important part of the workflow was evaluating, simplifying, and adapting generated output instead of blindly accepting it.

---

# AI Integration Note

The deterministic recommendation pipeline (filtering, scoring, ranking, and frontend integration) was implemented during the recorded build process.

The Gemini-based AI explanation layer was added afterward as a focused enhancement to generate concise recommendation summaries on top of the deterministic recommendation engine.

The core recommendation system remains fully functional even without the LLM layer, and fallback summaries are used if the Gemini API is unavailable or rate-limited.

---

# If you had another 4 hours, what would you add?

Given more time, I would improve:

- authenticated user persistence instead of browser-based localStorage sessions
- recommendation history UX
- comparison views between cars
- review summarization
- better recommendation explainability
- stronger mobile responsiveness
- improved fallback handling for LLM failures
- more calibrated recommendation scoring

I would also likely migrate SQLite to PostgreSQL for more production-like persistence and improve deployment automation.

I intentionally prioritized building a stable end-to-end recommendation system over adding more platform-level features.
