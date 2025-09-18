-- Seed data for Sanakota words table
-- Sample words with various linguistic data

INSERT INTO words (lemma, pos, translation, definition, synonyms, inflections, lexical_category, example_sentences) VALUES
(
    'beautiful',
    'adjective',
    'hermoso, bello',
    'Pleasing the senses or mind aesthetically; having qualities that give great pleasure or satisfaction to see, hear, think about, etc.',
    '["gorgeous", "stunning", "lovely", "attractive", "pretty", "handsome"]'::jsonb,
    '{"comparative": "more beautiful", "superlative": "most beautiful", "adverb": "beautifully"}'::jsonb,
    'appearance',
    '["The sunset was absolutely beautiful.", "She has a beautiful voice.", "The garden looks beautiful in spring."]'::jsonb
),
(
    'run',
    'verb',
    'correr',
    'Move at a speed faster than a walk, never having both or all the feet on the ground at the same time.',
    '["jog", "sprint", "dash", "race", "hurry"]'::jsonb,
    '{"past": "ran", "past_participle": "run", "present_participle": "running", "third_person": "runs"}'::jsonb,
    'movement',
    '["I run every morning for exercise.", "The dog runs in the park.", "She runs a successful business."]'::jsonb
),
(
    'knowledge',
    'noun',
    'conocimiento',
    'Facts, information, and skills acquired through experience or education; the theoretical or practical understanding of a subject.',
    '["wisdom", "understanding", "awareness", "comprehension", "expertise"]'::jsonb,
    '{"plural": "knowledges"}'::jsonb,
    'education',
    '["Knowledge is power.", "She has extensive knowledge of history.", "The book contains valuable knowledge."]'::jsonb
),
(
    'quickly',
    'adverb',
    'rápidamente',
    'At a fast speed; with rapidity; in a short time.',
    '["rapidly", "swiftly", "speedily", "fast", "promptly"]'::jsonb,
    '{"comparative": "more quickly", "superlative": "most quickly"}'::jsonb,
    'time',
    '["She quickly finished her homework.", "The car moved quickly down the street.", "He quickly understood the problem."]'::jsonb
),
(
    'house',
    'noun',
    'casa',
    'A building for human habitation, especially one that is lived in by a family or small group of people.',
    '["home", "residence", "dwelling", "abode", "domicile"]'::jsonb,
    '{"plural": "houses"}'::jsonb,
    'building',
    '["They live in a beautiful house.", "The house has a large garden.", "We bought a new house last year."]'::jsonb
),
(
    'think',
    'verb',
    'pensar',
    'Have a particular opinion, belief, or idea about someone or something; use one''s mind to consider or reason about something.',
    '["consider", "believe", "suppose", "imagine", "contemplate"]'::jsonb,
    '{"past": "thought", "past_participle": "thought", "present_participle": "thinking", "third_person": "thinks"}'::jsonb,
    'cognition',
    '["I think you are right.", "She thinks about her future.", "What do you think about this idea?"]'::jsonb
),
(
    'happy',
    'adjective',
    'feliz',
    'Feeling or showing pleasure or contentment; characterized by or indicative of pleasure, contentment, or joy.',
    '["joyful", "cheerful", "glad", "pleased", "content"]'::jsonb,
    '{"comparative": "happier", "superlative": "happiest", "noun": "happiness", "adverb": "happily"}'::jsonb,
    'emotion',
    '["She was happy to see her friend.", "The children looked happy playing.", "I feel happy today."]'::jsonb
),
(
    'book',
    'noun',
    'libro',
    'A written or printed work consisting of pages glued or sewn together along one side and bound in covers.',
    '["volume", "publication", "tome", "manual", "guide"]'::jsonb,
    '{"plural": "books"}'::jsonb,
    'literature',
    '["I love reading books.", "This book is very interesting.", "She wrote a book about history."]'::jsonb
),
(
    'learn',
    'verb',
    'aprender',
    'Gain or acquire knowledge of or skill in (something) by study, experience, or being taught.',
    '["study", "acquire", "master", "understand", "grasp"]'::jsonb,
    '{"past": "learned", "past_participle": "learned", "present_participle": "learning", "third_person": "learns"}'::jsonb,
    'education',
    '["Children learn quickly.", "I want to learn Spanish.", "She learned to play the piano."]'::jsonb
),
(
    'important',
    'adjective',
    'importante',
    'Of great significance or value; having serious meaning or worth.',
    '["significant", "crucial", "vital", "essential", "key"]'::jsonb,
    '{"comparative": "more important", "superlative": "most important", "noun": "importance"}'::jsonb,
    'significance',
    '["This is an important decision.", "Education is very important.", "The meeting is important for our project."]'::jsonb
);