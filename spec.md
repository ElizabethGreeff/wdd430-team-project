# Feature Specification: RentLog — Apartment Evidence and Expense Records

**Feature Branch**: `001-rentlog-evidence`  
**Created**: 2026-11-05  
**Status**: Draft  
**Input**: User description: "Create a project specification for RentLog from this user input: mobile-responsive full-stack web application for college students and young professionals to securely document apartment condition and track out-of-pocket maintenance expenses; organize move-in/move-out evidence and maintenance receipts in one secure place; prepare legal-grade documentation to send landlords for security-deposit recovery or reimbursement. Include project title and description, purpose and target audience, core workflow user stories covering sign up and CRUD, acceptance criteria for each story, API endpoints, and implementation priority."

## Project Overview

**Project title**: RentLog  

**Description**: RentLog is a mobile-responsive web application where renters can keep apartment-condition records, move-in and move-out evidence, and out-of-pocket maintenance expenses and receipts together. Renters can organize selected records into a clear evidence package to review, download, and send to a landlord when requesting a security-deposit return or expense reimbursement.

**Purpose**: Help renters document a rental's condition and maintenance costs in an organized, private, and retrievable place, reducing the effort and uncertainty involved in preparing a landlord-facing request.

**Target audience**: College students and young professionals who rent apartments, especially renters who need to create condition records, preserve receipts, or prepare a deposit-recovery or reimbursement request.

**Scope boundary**: RentLog organizes and presents user-provided evidence; it does not provide legal advice, determine legal rights, guarantee admissibility, or promise a deposit recovery. The initial feature is jurisdiction-neutral and does not generate jurisdiction-specific legal forms, notices, or deadline advice.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create and manage a private account (Priority: P1)

As a renter, I want to sign up and manage my account so that my apartment records are private to me and available across my devices.

**Why this priority**: An account is required to keep personal rental, financial, and photo records associated with the right renter and protected from other users.

**Independent Test**: Create a new account, sign in, view and update account details, sign out and back in, then delete the account and verify access is removed.

**Acceptance Scenarios**:

1. **Given** a visitor with a valid, unused email address, **When** they submit the required sign-up details, **Then** an account is created and they can access their private RentLog workspace.
2. **Given** an existing account, **When** its owner signs in with valid credentials, **Then** the owner can access their workspace; an invalid sign-in does not disclose private records.
3. **Given** a signed-in account owner, **When** they view or update their profile, **Then** RentLog shows or saves the permitted account details and confirms the result.
4. **Given** a signed-in account owner, **When** they request a password reset or sign out, **Then** RentLog provides an appropriate recovery or sign-out outcome without exposing account records.
5. **Given** an account owner who confirms account deletion, **When** deletion completes, **Then** the account and its associated private records are no longer available through that account.

### User Story 2 - Record a rental and condition evidence (Priority: P1)

As a renter, I want to create and maintain rental records and move-in or move-out condition reports, including notes and evidence, so that I can document the apartment over time.

**Why this priority**: A rental record and dated condition evidence are the foundation for comparing apartment condition and preparing a deposit request.

**Independent Test**: With a test account, create a rental, add a move-in report and room-level observations with photo or document evidence, review and edit them, then delete a test item and verify each change.

**Acceptance Scenarios**:

1. **Given** a signed-in renter, **When** they create a rental with its identifying details and tenancy dates, **Then** it appears in their rental list and is accessible only to that renter.
2. **Given** an existing rental, **When** its owner opens, edits, or deletes it, **Then** RentLog shows the saved details, persists the edit, or removes the rental and its dependent records after clear confirmation.
3. **Given** a renter's rental, **When** they create a move-in or move-out condition report with a date and room or area observations, **Then** the report is associated with that rental and can be reopened and edited.
4. **Given** a condition report, **When** its owner adds photos or documents and explanatory notes, **Then** the evidence is associated with the relevant report or observation and remains available to that owner.
5. **Given** evidence or a report that its owner edits or deletes, **When** the change is confirmed, **Then** RentLog reflects the change and makes clear which records or attachments will also be removed.
6. **Given** a user who does not own a rental or evidence item, **When** they attempt to view or change it, **Then** RentLog denies access and does not reveal the record's contents.

### User Story 3 - Track maintenance expenses and receipts (Priority: P1)

As a renter, I want to create and maintain out-of-pocket maintenance expense records and receipts so that I can support a reimbursement request with accurate details.

**Why this priority**: Itemized expenses and supporting receipts directly address renters' need to request reimbursement for costs they paid.

**Independent Test**: Create a maintenance expense for a rental, add its amount, currency, date, description, and receipt, then view, edit, and delete it and verify the expense list and totals.

**Acceptance Scenarios**:

1. **Given** a signed-in renter with a rental, **When** they record an expense with amount, currency, date, and description, **Then** it is saved under that rental and included in its expense list and total.
2. **Given** a saved expense, **When** its owner adds a receipt, **Then** the receipt is linked to the expense and can be viewed or downloaded by its owner.
3. **Given** a saved expense, **When** its owner views, edits, or deletes it, **Then** RentLog shows current saved details, persists the edit, or removes the expense and updates any displayed totals.
4. **Given** an expense with a missing, invalid, or non-positive amount, **When** the renter attempts to save it, **Then** RentLog explains the validation issue and does not add an invalid expense.
5. **Given** an expense belonging to another user, **When** a renter attempts to view or change it, **Then** RentLog denies access without disclosing its details.
6. **Given** a receipt attached to an expense, **When** its owner views, updates, or deletes it, **Then** RentLog shows the current receipt, saves the permitted update, or removes the receipt from that expense.

### User Story 4 - Prepare and download a landlord evidence package (Priority: P2)

As a renter, I want to select condition records and expenses for a clear evidence package so that I can review and send supporting documentation to my landlord.

**Why this priority**: A compiled package turns the collected records into a practical deposit-recovery or reimbursement request, but depends on records created in the P1 journeys.

**Independent Test**: Select a rental's condition reports, evidence, and expenses; preview the package; download it; and verify that it contains the selected records and original attachments without including unselected or other users' data.

**Acceptance Scenarios**:

1. **Given** a renter with saved records, **When** they select records for a package, **Then** RentLog presents a preview containing the rental identity, selected dated condition notes, selected evidence, itemized expenses, and a total by currency.
2. **Given** a package preview, **When** the renter confirms download, **Then** RentLog provides a readable summary and the selected original supporting files in an organized package.
3. **Given** a renter who changes selected records or details before confirmation, **When** they refresh the preview, **Then** the package reflects the current selection and clearly identifies dates and sources of evidence.
4. **Given** a package containing dates or timestamps, **When** it is reviewed, **Then** user-entered dates and system-recorded dates are distinguishable and are not represented as a guarantee of legal authenticity or admissibility.
5. **Given** an unauthorized user or an invalid package request, **When** they attempt to preview or download the package, **Then** RentLog denies access and does not expose private content.

### Edge Cases

- If an evidence upload is interrupted or cannot be processed, RentLog must explain that it was not saved and allow the renter to retry without creating a misleading partial record.
- If an expense uses a different currency from other expenses, totals must remain separated by currency rather than being combined inaccurately.
- If the renter's device is offline or a request fails while saving, RentLog must indicate whether the change was saved and avoid silently duplicating or losing a record on retry.
- If a renter deletes a rental, report, or expense that has linked records, RentLog must explain the effect and require confirmation before deleting dependent data.
- If a renter has no move-out report, receipt, or expenses, RentLog must still allow them to create and download a package from the records they selected and must not invent missing information.
- If a record is edited after a package is created, a newly prepared package must use the current selected record contents; previously downloaded copies remain under the renter's control.
- If an account is deleted, its private records and attachments must no longer be accessible to that account; records must not remain accessible through guessed or previously used record links.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: RentLog MUST allow a visitor to sign up for an account and allow an account owner to sign in, sign out, recover account access, view and update account details, and request account deletion.
- **FR-002**: RentLog MUST associate every rental, condition report, evidence item, expense, and evidence package with its owner and MUST deny access to users who do not own those records.
- **FR-003**: RentLog MUST allow an account owner to create, view, update, and delete rental records, including sufficient identifying details and tenancy dates.
- **FR-004**: RentLog MUST allow a renter to create, view, update, and delete move-in and move-out condition reports associated with a rental.
- **FR-005**: A condition report MUST support dated observations organized by room or area, explanatory notes, and associated photo or document evidence.
- **FR-006**: RentLog MUST allow a renter to create, view, update, and delete maintenance expense records associated with a rental, including description, date, positive amount, and currency.
- **FR-007**: RentLog MUST allow a renter to create, view, update, and delete supporting receipt files for expenses and evidence files for condition reports.
- **FR-008**: RentLog MUST validate required information and file input, explain invalid or failed submissions, and MUST NOT silently report an unsaved change as saved.
- **FR-009**: RentLog MUST display expense amounts and totals accurately and MUST separate totals by currency.
- **FR-010**: RentLog MUST allow a renter to select their own condition reports, evidence, and expenses for an evidence package and preview its contents before downloading it.
- **FR-011**: A downloaded evidence package MUST include a readable summary of the selected rental, dated condition observations, selected original evidence files, itemized selected expenses, and totals by currency. It MUST distinguish user-entered dates from system-recorded dates.
- **FR-012**: RentLog MUST NOT claim that an evidence package is legal advice, legally certified, or guaranteed admissible or sufficient for deposit recovery.
- **FR-013**: RentLog MUST provide responsive layouts and operable controls for common mobile and desktop browser screen sizes.
- **FR-014**: RentLog MUST support deletion of accounts and records with clear notice of the effect on associated records and attachments.

### Requested API Endpoints

The following is the requested initial API surface for the user journeys above. Each endpoint MUST enforce account ownership for private data and return an outcome that clearly indicates validation failures, missing records, or denied access.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/v1/auth/sign-ups` | Create an account |
| POST | `/api/v1/auth/sessions` | Sign in |
| DELETE | `/api/v1/auth/sessions/current` | Sign out |
| POST | `/api/v1/auth/password-reset-requests` | Request account recovery |
| POST | `/api/v1/auth/password-resets` | Complete account recovery |
| GET, PATCH, DELETE | `/api/v1/account` | View, update, or delete the current account |
| GET, POST | `/api/v1/rentals` | List or create rentals for the current account |
| GET, PATCH, DELETE | `/api/v1/rentals/{rentalId}` | View, update, or delete an owned rental |
| GET, POST | `/api/v1/rentals/{rentalId}/condition-reports` | List or create reports for an owned rental |
| GET, PATCH, DELETE | `/api/v1/condition-reports/{reportId}` | View, update, or delete an owned condition report |
| GET, POST | `/api/v1/condition-reports/{reportId}/evidence` | List or add evidence to an owned report |
| GET, PATCH, DELETE | `/api/v1/evidence/{evidenceId}` | View, update, or remove an owned evidence item |
| GET, POST | `/api/v1/rentals/{rentalId}/expenses` | List or create expenses for an owned rental |
| GET, PATCH, DELETE | `/api/v1/expenses/{expenseId}` | View, update, or delete an owned expense |
| GET, POST | `/api/v1/expenses/{expenseId}/receipts` | List or add receipts for an owned expense |
| GET, PATCH, DELETE | `/api/v1/receipts/{receiptId}` | View, update, or remove an owned receipt |
| POST | `/api/v1/rentals/{rentalId}/evidence-packages` | Prepare a preview/package for selected records in an owned rental |
| GET | `/api/v1/evidence-packages/{packageId}` | View an owned package preview |
| GET | `/api/v1/evidence-packages/{packageId}/download` | Download an owned package |

### Implementation Priority

1. **P1 — Account access and privacy**: Account creation, sign-in/sign-out, account management, ownership checks, and deletion.
2. **P1 — Rental and condition records**: Rental CRUD, move-in/move-out report CRUD, observations, and evidence management.
3. **P1 — Expense records**: Expense CRUD, receipt management, validation, and currency-aware totals.
4. **P2 — Evidence package**: Record selection, preview, readable summary, original attachments, and download.
5. **Release-wide requirement**: Mobile-responsive workflows, clear error states, and validation of access boundaries apply across all priorities.

### Project Constraints

- Feature design MUST use the RentLog application stack: Next.js App Router, TypeScript, and Tailwind CSS.
- Feature behavior and user interfaces MUST support RentLog's apartment-condition documentation or out-of-pocket maintenance-expense tracking purpose as applicable.
- User-facing interfaces MUST account for mobile-responsive use.

### Assumptions

- The initial audience is individual renters managing their own rentals; collaborative access for roommates, co-signers, landlords, or property managers is out of scope.
- RentLog will allow renters to enter dates and details themselves and will identify those as user-provided information rather than independently verified facts.
- “Legal-grade documentation” means a well-organized, reviewable collection of user-provided records and original files, not a legal opinion, certification, or guarantee of admissibility. No jurisdiction-specific legal workflow is in scope for this initial feature.
- Renters review and send downloaded packages themselves; RentLog does not send records to landlords or expose them through public links.
- Amounts in a single expense use one currency; RentLog does not perform currency conversion.
- The initial account model uses email-based sign-up and recovery. Specific credential policy and verification details are defined during planning.

### Key Entities *(include if data involved)*

- **Account**: A renter's sign-in identity and private workspace; owns rentals and their related records.
- **Rental**: A renter's apartment and tenancy record, including identifying details and tenancy dates.
- **Condition Report**: A move-in or move-out record for a rental, with a date and observations organized by room or area.
- **Evidence Item**: A renter-provided photo or document and associated explanatory context, linked to a condition report or expense.
- **Expense**: An out-of-pocket maintenance cost associated with a rental, with date, description, amount, currency, and optional receipt.
- **Evidence Package**: A previewable and downloadable selection of a rental's condition records, evidence, and expenses, with a readable summary and original attachments.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At least 90% of first-time test renters can create an account and reach their private workspace in under 3 minutes.
- **SC-002**: At least 90% of test renters can create a rental and save a first dated condition observation with supporting evidence in under 5 minutes.
- **SC-003**: At least 95% of test renters can correctly create, find, edit, and delete a test rental, condition report, and expense without assistance.
- **SC-004**: At least 95% of test renters can prepare and download a package containing the records they selected, with no unselected or other-user data included.
- **SC-005**: In access-control validation, 100% of attempts by one test account to view or modify another test account's records or package are denied without exposing private contents.
- **SC-006**: Core sign-up, rental, condition-report, expense, and package-review workflows remain operable at mobile viewport widths of 360 pixels and larger without loss of required content or actions.
- **SC-007**: In user testing, at least 90% of renters can identify the amount, currency, date, and supporting receipt for each expense included in a package.
