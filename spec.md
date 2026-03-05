# Male Model Portfolio

## Current State
New project. No existing code or content.

## Requested Changes (Diff)

### Add
- Public-facing portfolio website with parallax scrolling, scroll-triggered animations, and a high-fashion dark aesthetic
- Hero/Landing section with full-bleed parallax image and bold text overlay
- About/Bio section with editable model biography text
- Portfolio Galleries section with masonry layout, hover effects, lightbox view, and category tabs (Editorial, Commercial, Runway, Lifestyle)
- Stats section displaying height, measurements, agency info (editable)
- Contact section with contact details (editable)
- Secure admin panel (behind login) to manage all content:
  - Add/edit/delete gallery photos with captions and category tags
  - Edit bio/about text
  - Edit model stats (height, measurements, agency info)
  - Manage portfolio section order
  - Update contact information
- All content served from the Motoko backend, reflecting live updates on the public site
- Sample/seed data: placeholder images (solid color blocks or silhouettes), sample bio, sample stats, sample gallery items

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan

### Backend (Motoko)
- Data types: Photo (id, url, caption, category, order), BioContent (text), Stats (height, chest, waist, hips, shoes, agency, agencyUrl), ContactInfo (email, phone, instagram, location), SectionOrder ([sectionName])
- CRUD endpoints for Photos: getPhotos, addPhoto, updatePhoto, deletePhoto
- Get/set endpoints for Bio, Stats, ContactInfo, SectionOrder
- Admin auth via authorization component (single admin role)
- Blob storage component for photo uploads

### Frontend
- React + TypeScript + Tailwind CSS
- Public pages:
  - Single-page scrolling site with smooth transitions between sections
  - Parallax depth effect using scroll position (translateY on background layers)
  - Scroll-triggered fade-in/slide-up animations using IntersectionObserver
  - Gallery: masonry grid with hover zoom and lightbox modal
  - Stats section: elegant table/card layout
  - Contact section: styled contact info display
- Admin panel (separate route `/admin`):
  - Login gate via authorization component
  - Dashboard with tabs: Gallery, Bio, Stats, Sections, Contact
  - Gallery manager: upload photo, set caption/category, reorder, delete
  - Bio editor: textarea with save
  - Stats editor: form fields for all stat values
  - Section order manager: drag-to-reorder list
  - Contact info editor: form fields
- Seed/placeholder content included in initial state
