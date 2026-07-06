# AIOS Component Library V2

Status: Official Implementation Contract
Owner: Chief Design Systems Engineer, Frontend Architecture Lead
Applies To: All AIOS frontend surfaces (product, workspace, admin, marketing, auth)
Supersedes: Component Library V1 and any ad-hoc component usage

---

## 0. Contract Statement

This document defines the complete reusable component system for AIOS.

No page, feature, module, or AI-generated implementation may invent new UI component categories outside this specification.

If a new component is needed, it must be added to this contract through formal design system governance.

Alignment required with:

- AIOS Frontend Blueprint V1
- AIOS Brand Guidelines V1
- AIOS Design System V2
- AIOS UX Guidelines V1
- Master PRD and architecture contracts

---

## 1. Global Component Standards

### 1.1 Universal Quality Rules

- Enterprise-first clarity
- Minimal visual noise
- Information-first hierarchy
- Accessibility-first interaction
- Motion with purpose only
- Deterministic states
- Keyboard operability by default

### 1.2 Universal States

Every component must support, where relevant:

- Default
- Hover
- Focus-visible
- Active/Pressed
- Selected
- Disabled
- Loading
- Error
- Success
- Empty

### 1.3 Universal Size Tokens

- xs
- sm
- md
- lg
- xl

### 1.4 Universal Props Pattern

- id
- className
- dataTestId
- size
- variant
- disabled
- loading
- ariaLabel
- ariaDescribedBy
- tooltip

### 1.5 Universal Events Pattern

- onFocus
- onBlur
- onHoverStart
- onHoverEnd
- onKeyDown
- onClick or onChange (component specific)

### 1.6 Universal Accessibility Rules

- WCAG AA+ contrast and semantics
- Logical tab order
- Focus visible at all times
- Screen reader labels for icon-only controls
- Reduced motion respected

### 1.7 Universal Motion Rules

- Hover: 0.16s to 0.24s
- State change: 0.2s to 0.4s
- Enter/exit: 0.4s to 0.8s
- Framer Motion compatible behavior required

### 1.8 Universal Token Families

- color.brand.*
- color.surface.*
- color.text.*
- color.border.*
- color.semantic.*
- space.*
- radius.*
- shadow.*
- type.*

### 1.9 Universal Spec Template

Every component entry below includes:

- Purpose
- Business value
- Visual description
- When to use
- When not to use
- Variants
- Sizes
- States
- Responsive behavior
- Keyboard behavior
- ARIA guidance
- Animations
- Spacing
- Typography
- Color tokens
- Icons
- Props
- Events
- Usage examples
- Do
- Don’t
- Related components

---

## 2. Buttons

### 2.1 Primary Button

Purpose: Main call-to-action.
Business value: Drives core flow completion.
Visual description: Filled brand primary with high contrast text.
When to use: One dominant action per section.
When not to use: Secondary or destructive actions.
Variants: default, withLeadingIcon, withTrailingIcon.
Sizes: sm, md, lg.
States: default, hover, focus, active, disabled, loading.
Responsive behavior: Full-width optional on mobile.
Keyboard behavior: Enter/Space activates.
ARIA guidance: Use role button; loading state announced.
Animations: Subtle elevation and color shift on hover.
Spacing: Horizontal padding space.4 to space.6.
Typography: type.button.
Color tokens: color.action.primary.*
Icons: Optional 16 to 20px icons.
Props: label, iconStart, iconEnd, disabled, loading.
Events: onClick.
Usage examples: Approve recommendation.
Do: Keep singular and decisive.
Don’t: Place multiple primary buttons side by side.
Related components: Secondary Button, Confirmation Dialog.

### 2.2 Secondary Button

Purpose: Secondary action.
Business value: Supports alternate path without competing with primary.
Visual description: Neutral surface, visible border.
When to use: Secondary actions in same action group.
When not to use: Highest-priority action.
Variants: default, subtle.
Sizes: sm, md, lg.
States: default, hover, focus, active, disabled.
Responsive behavior: Stack below primary on mobile.
Keyboard behavior: Enter/Space.
ARIA guidance: Native button semantics.
Animations: Border and bg transition only.
Spacing: Same as Primary.
Typography: type.button.
Color tokens: color.action.secondary.*
Icons: Optional.
Props: label, iconStart, iconEnd, disabled.
Events: onClick.
Usage examples: Cancel draft.
Do: Place left of primary in LTR flows.
Don’t: Style as destructive.
Related components: Primary Button, Ghost Button.

### 2.3 Ghost Button

Purpose: Low-emphasis action.
Business value: Keeps dense toolbars clean.
Visual description: Text-first, transparent background.
When to use: Contextual actions in cards and tables.
When not to use: Primary commit actions.
Variants: neutral, brand.
Sizes: xs, sm, md.
States: default, hover, focus, active, disabled.
Responsive behavior: Collapse to icon-only when constrained.
Keyboard behavior: Standard button behavior.
ARIA guidance: Clear accessible name required.
Animations: Opacity and tint shift.
Spacing: Compact padding.
Typography: type.button.
Color tokens: color.text.secondary, color.bg.subtle.
Icons: Optional.
Props: label, icon, iconOnly.
Events: onClick.
Usage examples: Open quick filters.
Do: Use for tertiary actions.
Don’t: Use as only call-to-action.
Related components: Icon Button, Context Menu.

### 2.4 Outline Button

Purpose: Mid-emphasis action with strong boundary.
Business value: Useful on tinted surfaces.
Visual description: Transparent fill, clear border.
When to use: Alternative primary in dense action groups.
When not to use: Minimal text-only actions.
Variants: neutral, brand.
Sizes: sm, md, lg.
States: default, hover, focus, active, disabled.
Responsive behavior: Same as Secondary.
Keyboard behavior: Standard.
ARIA guidance: Native button.
Animations: Border and background transitions.
Spacing: Medium.
Typography: type.button.
Color tokens: color.border.strong, color.text.brand.
Icons: Optional.
Props: label, iconStart, iconEnd.
Events: onClick.
Usage examples: Export report.
Do: Keep icon optional and meaningful.
Don’t: Mix with high-contrast danger tones.
Related components: Secondary Button.

### 2.5 Danger Button

Purpose: Destructive action.
Business value: Prevents accidental harmful operations.
Visual description: Semantic error styling.
When to use: Delete, revoke, irreversible operations.
When not to use: Routine actions.
Variants: filled, outline.
Sizes: sm, md, lg.
States: default, hover, focus, active, disabled, loading.
Responsive behavior: Require confirmation on mobile.
Keyboard behavior: Standard.
ARIA guidance: Include consequence in ariaDescription.
Animations: Minimal; avoid playful feedback.
Spacing: Medium.
Typography: type.button.
Color tokens: color.semantic.error.*
Icons: Optional warning icon.
Props: label, confirmIntentFlag.
Events: onClick.
Usage examples: Remove workflow.
Do: Pair with confirmation dialog.
Don’t: Use for non-destructive exits.
Related components: Confirmation Dialog.

### 2.6 Success Button

Purpose: Positive commit in guided flows.
Business value: Reinforces safe completion actions.
Visual description: Semantic success fill.
When to use: Confirm resolved or complete state.
When not to use: General primary action.
Variants: filled, subtle.
Sizes: sm, md, lg.
States: default, hover, focus, active, disabled.
Responsive behavior: Standard.
Keyboard behavior: Standard.
ARIA guidance: Button semantics.
Animations: Subtle color shift.
Spacing: Medium.
Typography: type.button.
Color tokens: color.semantic.success.*
Icons: Optional check icon.
Props: label, iconStart.
Events: onClick.
Usage examples: Mark task completed.
Do: Use sparingly.
Don’t: Replace primary brand actions globally.
Related components: Success Alert.

### 2.7 Icon Button

Purpose: Compact action trigger.
Business value: Saves space in dense control areas.
Visual description: Square/circle hit target with icon.
When to use: Toolbar controls, small action clusters.
When not to use: Ambiguous high-impact actions without label.
Variants: ghost, subtle, outline.
Sizes: sm, md, lg.
States: default, hover, focus, active, disabled.
Responsive behavior: Maintain 44x44 minimum touch target on mobile.
Keyboard behavior: Enter/Space.
ARIA guidance: ariaLabel mandatory.
Animations: Light scale or tint.
Spacing: Tight.
Typography: N/A.
Color tokens: color.text.secondary, color.bg.subtle.
Icons: Required.
Props: icon, ariaLabel, tooltip.
Events: onClick.
Usage examples: Open command palette.
Do: Always include tooltip.
Don’t: Use icon-only for destructive action without confirmation.
Related components: Ghost Button, Context Menu.

### 2.8 Split Button

Purpose: Primary action plus alternate menu.
Business value: Speeds frequent default action while preserving options.
Visual description: Combined button with divider and chevron segment.
When to use: Repeated actions with known default.
When not to use: Single-option actions.
Variants: primary, secondary.
Sizes: md, lg.
States: default, hover, focus, active, disabled.
Responsive behavior: Collapse to dropdown button on mobile.
Keyboard behavior: Enter executes default; ArrowDown opens menu.
ARIA guidance: Menu button pattern on dropdown segment.
Animations: Menu reveal transition.
Spacing: Standard button spacing.
Typography: type.button.
Color tokens: action tokens by variant.
Icons: Chevron required.
Props: defaultAction, menuItems.
Events: onDefaultClick, onMenuOpen, onMenuSelect.
Usage examples: Create recommendation from template.
Do: Keep default action clear.
Don’t: Hide critical options behind tiny menus.
Related components: Dropdown Button, Dropdown Menu.

### 2.9 Loading Button

Purpose: Action in progress indicator.
Business value: Prevents duplicate submissions.
Visual description: Spinner plus disabled interaction.
When to use: Async submit actions.
When not to use: Immediate local-only interactions.
Variants: mirrors base button variants.
Sizes: sm, md, lg.
States: loading, success, error fallback.
Responsive behavior: Preserve width during loading.
Keyboard behavior: Disabled while loading.
ARIA guidance: ariaBusy true; announce loading label.
Animations: Spinner rotation only.
Spacing: Keep label area reserved.
Typography: type.button.
Color tokens: inherits parent variant.
Icons: Spinner icon.
Props: loadingText.
Events: onClick.
Usage examples: Save settings.
Do: Disable repeated trigger.
Don’t: Remove label width causing layout jump.
Related components: Progress Bar.

### 2.10 Dropdown Button

Purpose: Trigger action menu.
Business value: Consolidates low-frequency actions.
Visual description: Button with chevron.
When to use: Related action set > 2 items.
When not to use: Core primary action.
Variants: secondary, ghost.
Sizes: sm, md.
States: default, hover, open, focus, disabled.
Responsive behavior: Full-width menu on mobile.
Keyboard behavior: Enter/Space open; arrows navigate.
ARIA guidance: ariaHasPopup menu; ariaExpanded.
Animations: Menu fade-slide.
Spacing: Standard.
Typography: type.button.
Color tokens: secondary action tokens.
Icons: Chevron.
Props: items, placement.
Events: onOpen, onSelect.
Usage examples: Export formats.
Do: Group logically.
Don’t: Mix destructive item without separator.
Related components: Dropdown Menu, Split Button.

### 2.11 Floating Action Button

Purpose: Persistent high-priority quick create.
Business value: Speeds repetitive creation workflow.
Visual description: Elevated circular/squircle action button.
When to use: Mobile or workspace quick-create contexts.
When not to use: Desktop pages with clear fixed headers.
Variants: primary, success.
Sizes: md, lg.
States: default, hover, focus, active, disabled.
Responsive behavior: Primarily mobile/tablet.
Keyboard behavior: Tab reachable; Enter/Space.
ARIA guidance: Explicit creation action label.
Animations: Entrance and subtle pulse only when relevant.
Spacing: Bottom safe-area aware.
Typography: Icon-only or short label.
Color tokens: color.action.primary.*
Icons: Plus or context action icon.
Props: icon, label, position.
Events: onClick.
Usage examples: Quick add task.
Do: Use one FAB max per view.
Don’t: Compete with other primary CTA.
Related components: Quick Actions Panel.

---

## 3. Inputs

### 3.1 Text Input

Purpose: Single-line free text.
Business value: Core data capture.
Visual description: Labeled field with clear boundary.
When to use: Names, titles, short values.
When not to use: Long-form content.
Variants: default, filled.
Sizes: sm, md, lg.
States: default, focus, filled, error, disabled, success.
Responsive behavior: Full-width on mobile.
Keyboard behavior: Standard text entry.
ARIA guidance: Label association required.
Animations: Focus ring transition.
Spacing: Label and help text spacing.
Typography: type.form.input.
Color tokens: surface, border, text tokens.
Icons: Optional leading/trailing.
Props: value, placeholder, maxLength.
Events: onChange, onFocus, onBlur.
Usage examples: Workspace name.
Do: Always show label.
Don’t: Use placeholder as only label.
Related components: Textarea, Search Input.

### 3.2 Textarea

Purpose: Multi-line input.
Business value: Captures rationale and notes.
Visual description: Resizable multi-line field.
When to use: Explanations, summaries, comments.
When not to use: Short single-field entries.
Variants: fixedHeight, autoGrow.
Sizes: md, lg.
States: default, focus, error, disabled.
Responsive behavior: AutoGrow preferred on mobile.
Keyboard behavior: Enter line-break.
ARIA guidance: Describe expected content length.
Animations: Height transition optional.
Spacing: Generous internal padding.
Typography: type.form.input.
Color tokens: standard input tokens.
Icons: Optional character counter.
Props: rows, maxRows.
Events: onChange.
Usage examples: Decision rationale.
Do: Provide character guidance for limits.
Don’t: Use for tiny values.
Related components: AI Prompt Input.

### 3.3 Search Input

Purpose: Query data in scope.
Business value: Fast retrieval.
Visual description: Input with search icon and optional clear action.
When to use: List/table filtering and global search bar.
When not to use: Structured form field.
Variants: global, local.
Sizes: sm, md, lg.
States: default, typing, loading, results, empty, error.
Responsive behavior: Expands to full-width on mobile.
Keyboard behavior: Enter submit; arrow navigate suggestions.
ARIA guidance: combobox pattern when suggestion list exists.
Animations: Suggestion dropdown reveal.
Spacing: compact.
Typography: type.form.input.
Color tokens: neutral/surface tokens.
Icons: search, clear.
Props: query, debounceMs.
Events: onQueryChange, onSubmit.
Usage examples: Search contexts.
Do: Show search scope.
Don’t: Hide active filters that affect results.
Related components: Autocomplete, Command Palette.

### 3.4 Email Input

Purpose: Email-specific entry.
Business value: Reduces invalid identity data.
Visual description: Text input with email validation hints.
When to use: Auth and profile forms.
When not to use: Generic text fields.
Variants: standard.
Sizes: md, lg.
States: default, invalidFormat, valid, disabled.
Responsive behavior: Standard.
Keyboard behavior: Email keyboard on mobile.
ARIA guidance: input type email.
Animations: validation feedback.
Spacing: standard form spacing.
Typography: type.form.input.
Color tokens: input + semantic.
Icons: optional mail icon.
Props: value.
Events: onChange, onBlur.
Usage examples: Invite user.
Do: Validate domain format.
Don’t: Block common enterprise aliases.
Related components: Password Input.

### 3.5 Password Input

Purpose: Secure credential entry.
Business value: Authentication integrity.
Visual description: Masked input with reveal toggle.
When to use: Auth and credential reset.
When not to use: Non-sensitive data.
Variants: standard.
Sizes: md, lg.
States: default, focused, invalid, disabled.
Responsive behavior: Standard.
Keyboard behavior: Standard secure entry.
ARIA guidance: reveal toggle accessible state.
Animations: none beyond focus.
Spacing: standard.
Typography: type.form.input.
Color tokens: input tokens.
Icons: eye/eye-off.
Props: revealEnabled.
Events: onChange.
Usage examples: Sign in.
Do: Offer strength feedback where relevant.
Don’t: Auto-reveal by default.
Related components: 2FA Input.

### 3.6 Phone Input

Purpose: Phone number entry.
Business value: Reliable contact and verification flows.
Visual description: Number input with country selector.
When to use: Profile, verification.
When not to use: Numeric IDs.
Variants: international, local.
Sizes: md, lg.
States: default, invalid, disabled.
Responsive behavior: Country selector as full sheet on mobile.
Keyboard behavior: Numeric keypad.
ARIA guidance: country selector labeled.
Animations: dropdown open.
Spacing: standard.
Typography: type.form.input.
Color tokens: input tokens.
Icons: flag/country indicator.
Props: countryCode, value.
Events: onChange.
Usage examples: 2FA enrollment.
Do: Normalize formatting.
Don’t: Reject valid global formats.
Related components: Number Input.

### 3.7 Number Input

Purpose: Numeric value entry.
Business value: Valid metric input.
Visual description: Numeric field with optional steppers.
When to use: Quantities, thresholds.
When not to use: IDs with leading zeros.
Variants: stepper, plain.
Sizes: sm, md.
States: default, error, disabled.
Responsive behavior: larger touch steppers on mobile.
Keyboard behavior: ArrowUp/Down optional step.
ARIA guidance: spinbutton pattern if steppers used.
Animations: subtle step feedback.
Spacing: compact.
Typography: type.form.input.
Color tokens: input tokens.
Icons: optional steppers.
Props: min, max, step.
Events: onChange.
Usage examples: Retry count.
Do: Clamp with visible message.
Don’t: Silent auto-correct without notice.
Related components: Currency Input.

### 3.8 Currency Input

Purpose: Monetary value entry.
Business value: Financial accuracy.
Visual description: Number field with currency symbol/code.
When to use: Revenue, cost, budget forms.
When not to use: Non-financial numeric fields.
Variants: symbolPrefix, codeSuffix.
Sizes: md, lg.
States: default, error, disabled.
Responsive behavior: locale-aware formatting.
Keyboard behavior: Numeric keyboard.
ARIA guidance: announce currency unit.
Animations: none beyond focus/validation.
Spacing: standard.
Typography: type.form.input.
Color tokens: input tokens.
Icons: optional currency symbol.
Props: currency, locale.
Events: onChange.
Usage examples: Forecast update.
Do: Show separators.
Don’t: Strip decimals unexpectedly.
Related components: Number Input.

### 3.9 Date Input

Purpose: Single date selection.
Business value: Temporal consistency.
Visual description: Input with calendar picker.
When to use: Scheduling and reporting ranges.
When not to use: Time-only fields.
Variants: inline, popover.
Sizes: md.
States: default, focused, invalid, disabled.
Responsive behavior: full-screen picker on mobile.
Keyboard behavior: Arrow navigation in calendar.
ARIA guidance: date grid semantics.
Animations: picker reveal.
Spacing: standard.
Typography: type.form.input.
Color tokens: input tokens.
Icons: calendar.
Props: minDate, maxDate.
Events: onChange.
Usage examples: Report date.
Do: Display timezone context when needed.
Don’t: Assume locale without explicit formatting.
Related components: Date Range Input.

### 3.10 Time Input

Purpose: Time-of-day selection.
Business value: scheduling precision.
Visual description: HH:MM selector input.
When to use: reminders, execution windows.
When not to use: date-time combined fields.
Variants: 12h, 24h.
Sizes: md.
States: default, error, disabled.
Responsive behavior: wheel selector on mobile optional.
Keyboard behavior: arrow increments.
ARIA guidance: time input labeled with timezone if relevant.
Animations: none heavy.
Spacing: standard.
Typography: type.form.input.
Color tokens: input tokens.
Icons: clock optional.
Props: format, stepMinutes.
Events: onChange.
Usage examples: Automation schedule.
Do: Clarify timezone.
Don’t: Mix local and UTC silently.
Related components: Date Input.

### 3.11 Date Range Input

Purpose: Start-end temporal window.
Business value: core analytics and replay filtering.
Visual description: dual date controls with range preview.
When to use: reporting, timeline analysis.
When not to use: single date fields.
Variants: compact, expanded.
Sizes: md, lg.
States: default, selecting, invalidRange, disabled.
Responsive behavior: full-screen range picker mobile.
Keyboard behavior: calendar navigation and range selection.
ARIA guidance: start/end labels and announcements.
Animations: panel reveal.
Spacing: medium.
Typography: type.form.input.
Color tokens: input tokens + info highlight.
Icons: calendar/range icon.
Props: startDate, endDate, presets.
Events: onRangeChange.
Usage examples: Replay timeline filter.
Do: Provide quick presets.
Don’t: Allow invalid reversed ranges without feedback.
Related components: Date Input.

### 3.12 Tags Input

Purpose: Create/manage tokenized labels.
Business value: flexible categorization.
Visual description: input that turns entries into chips.
When to use: labels, topics, segments.
When not to use: strict taxonomy selections.
Variants: freeText, constrained.
Sizes: md, lg.
States: default, editing, invalidTag, disabled.
Responsive behavior: wraps chips cleanly.
Keyboard behavior: Enter add; Backspace remove last.
ARIA guidance: listbox-like announcement for chips.
Animations: chip add/remove transitions.
Spacing: chip gap space.2.
Typography: type.form.input + type.small.
Color tokens: chip tokens.
Icons: optional remove icon.
Props: tags, maxTags.
Events: onAddTag, onRemoveTag.
Usage examples: Insight labels.
Do: Validate duplicates.
Don’t: Use for long free text.
Related components: Chip Selector.

### 3.13 Autocomplete Input

Purpose: Predictive suggestions during typing.
Business value: faster, more accurate entry.
Visual description: input with suggestion list.
When to use: entity lookup.
When not to use: tiny static options.
Variants: singleSelect, freeSolo.
Sizes: md, lg.
States: idle, loading, results, noResults, error.
Responsive behavior: full-width suggestion panel mobile.
Keyboard behavior: arrows + Enter select.
ARIA guidance: combobox + listbox roles.
Animations: dropdown enter/exit.
Spacing: standard.
Typography: type.form.input.
Color tokens: surface/border/text tokens.
Icons: search optional.
Props: options, asyncProvider.
Events: onInputChange, onSelect.
Usage examples: Select customer.
Do: Highlight matched term.
Don’t: Trigger network calls on every keystroke without debounce.
Related components: Search Input, Combobox.

### 3.14 AI Prompt Input

Purpose: Structured AI instruction entry.
Business value: consistent high-quality AI interaction.
Visual description: multi-line composer with context chips and send action.
When to use: prompting agents and AI assistants.
When not to use: standard text comments.
Variants: compact, expanded, withAttachments.
Sizes: md, lg.
States: idle, composing, sending, error, disabled.
Responsive behavior: sticky bottom composer mobile.
Keyboard behavior: Enter submit or Shift+Enter newline (configurable).
ARIA guidance: announce send status and token/length limits.
Animations: send/loading transitions.
Spacing: generous internal spacing.
Typography: type.form.input.
Color tokens: surface raised + brand action tokens.
Icons: send, attach, context.
Props: value, contextId, attachments.
Events: onSubmitPrompt, onAttach.
Usage examples: Request replay summary.
Do: Show context scope before send.
Don’t: Hide latency state.
Related components: Prompt Composer, Conversation Panel.

---

## 4. Selectors

### 4.1 Dropdown Selector

Purpose: Select one value from short/medium option list.
Business value: controlled input quality.
Visual description: trigger with menu list.
When to use: fixed options.
When not to use: very long options without search.
Variants: single, grouped.
Sizes: sm, md, lg.
States: closed, open, selected, disabled, error.
Responsive behavior: bottom sheet on mobile.
Keyboard behavior: arrow nav, Enter select, Esc close.
ARIA guidance: listbox pattern.
Animations: menu reveal.
Spacing: standard.
Typography: type.form.input.
Color tokens: input/select tokens.
Icons: chevron.
Props: options, value.
Events: onChange.
Usage examples: Select department.
Do: Keep label concise.
Don’t: Hide selected state.
Related components: Combobox.

### 4.2 Combobox

Purpose: Select or search-select from large list.
Business value: scalable option discovery.
Visual description: input + filtered menu.
When to use: large entity lists.
When not to use: tiny static sets.
Variants: single, creatable.
Sizes: md, lg.
States: typing, loading, open, selected, error.
Responsive behavior: full panel mobile.
Keyboard behavior: combobox standard.
ARIA guidance: combobox + active descendant.
Animations: list reveal.
Spacing: standard.
Typography: form input.
Color tokens: surface/border/text.
Icons: search/chevron.
Props: query, options.
Events: onQueryChange, onSelect.
Usage examples: Assign owner.
Do: debounce async queries.
Don’t: overload with excessive metadata.
Related components: Autocomplete.

### 4.3 Checkbox

Purpose: Multi-select boolean choice.
Business value: efficient selection in forms/tables.
Visual description: square control with checkmark.
When to use: multiple independent options.
When not to use: mutually exclusive choices.
Variants: default, indeterminate.
Sizes: sm, md.
States: unchecked, checked, indeterminate, disabled.
Responsive behavior: keep touch-safe hitbox.
Keyboard behavior: Space toggle.
ARIA guidance: role checkbox, ariaChecked mixed for indeterminate.
Animations: check transition.
Spacing: label gap space.2.
Typography: type.body.s.
Color tokens: brand/border tokens.
Icons: checkmark.
Props: checked, indeterminate.
Events: onChange.
Usage examples: Bulk row selection.
Do: Use clear labels.
Don’t: hide label context.
Related components: Radio.

### 4.4 Radio

Purpose: Single-select among options.
Business value: clear exclusivity.
Visual description: circle control with inner dot.
When to use: one required selection.
When not to use: multi-selection settings.
Variants: standard.
Sizes: sm, md.
States: unchecked, checked, disabled.
Responsive behavior: stack vertically mobile.
Keyboard behavior: Arrow keys in radio group.
ARIA guidance: role radiogroup/radio.
Animations: selection fill transition.
Spacing: option gap space.3.
Typography: type.body.s.
Color tokens: brand/border/text.
Icons: dot indicator.
Props: value, selected.
Events: onChange.
Usage examples: Confidence mode selection.
Do: Keep option labels concise.
Don’t: exceed 7 options without grouping.
Related components: Segmented Control.

### 4.5 Toggle

Purpose: Immediate on/off state.
Business value: quick setting updates.
Visual description: switch track and thumb.
When to use: binary settings with immediate effect.
When not to use: actions needing confirmation.
Variants: default.
Sizes: sm, md.
States: on, off, disabled, loading.
Responsive behavior: larger hit target mobile.
Keyboard behavior: Space/Enter toggle.
ARIA guidance: role switch, ariaChecked.
Animations: thumb slide 0.2s.
Spacing: label alignment.
Typography: type.body.s.
Color tokens: success/neutral tracks.
Icons: optional on/off glyph.
Props: checked.
Events: onChange.
Usage examples: Realtime updates toggle.
Do: reflect current state instantly.
Don’t: use for delayed apply settings.
Related components: Checkbox.

### 4.6 Segmented Control

Purpose: Compact mutually exclusive mode selector.
Business value: fast view switching.
Visual description: grouped pill segments.
When to use: 2 to 5 view modes.
When not to use: many options.
Variants: text, iconText.
Sizes: sm, md.
States: selected, hover, disabled.
Responsive behavior: horizontal scroll mobile if needed.
Keyboard behavior: Arrow key navigation.
ARIA guidance: tablist or radiogroup pattern.
Animations: active indicator slide.
Spacing: segment padding space.3.
Typography: type.button.
Color tokens: surface/border/brand.
Icons: optional.
Props: options, selected.
Events: onChange.
Usage examples: Timeline granularity switch.
Do: limit option count.
Don’t: mix unrelated modes.
Related components: Tabs.

### 4.7 Chip Selector

Purpose: Multi-select quick filters.
Business value: fast faceted filtering.
Visual description: selectable chips.
When to use: common filter categories.
When not to use: deep hierarchical taxonomy.
Variants: single, multi.
Sizes: sm, md.
States: unselected, selected, disabled.
Responsive behavior: wrap rows on mobile.
Keyboard behavior: Tab and Space select.
ARIA guidance: role option/listbox or button group pattern.
Animations: selection tint transition.
Spacing: chip gap space.2.
Typography: type.small.
Color tokens: chip selected/unselected tokens.
Icons: optional close/check.
Props: options, selectedValues.
Events: onSelectionChange.
Usage examples: Filter by risk level.
Do: keep labels short.
Don’t: overload with >12 chips without search.
Related components: Tags Input.

### 4.8 Tree Selector

Purpose: Hierarchical selection.
Business value: supports enterprise org structures.
Visual description: expandable node list with selection controls.
When to use: department/project/location hierarchies.
When not to use: flat simple lists.
Variants: single, multi with cascading selection.
Sizes: md, lg.
States: collapsed, expanded, selected, partial, disabled.
Responsive behavior: full-screen panel mobile.
Keyboard behavior: Arrow expand/collapse; Space select.
ARIA guidance: tree/treeitem semantics.
Animations: expand/collapse transitions.
Spacing: level indentation by space.4.
Typography: type.body.s.
Color tokens: text/border/selection tokens.
Icons: chevrons, node type icons.
Props: nodes, expandedKeys.
Events: onExpand, onSelect.
Usage examples: Select business unit.
Do: show selected path summary.
Don’t: hide parent-child selection logic.
Related components: Multi-select, Dropdown.

### 4.9 Multi-select

Purpose: Select multiple values from option list.
Business value: precise scoped filtering.
Visual description: selector with selected tokens.
When to use: moderate-size option sets.
When not to use: binary toggles.
Variants: withSearch, grouped.
Sizes: md, lg.
States: default, open, selected, overflow, disabled.
Responsive behavior: modal sheet mobile.
Keyboard behavior: arrows + Enter + Backspace token remove.
ARIA guidance: combobox/listbox multiselect pattern.
Animations: token add/remove transitions.
Spacing: standard.
Typography: form input.
Color tokens: selector/chip tokens.
Icons: checkmarks.
Props: selectedValues, options.
Events: onChange.
Usage examples: Multi-team filter.
Do: provide clear selected count.
Don’t: truncate selected values without expand control.
Related components: Combobox, Chip Selector.

---

## 5. Navigation Components

### 5.1 Top Navigation

Purpose: Global command and context bar.
Business value: OS continuity across modules.
Visual description: persistent horizontal bar.
When to use: all authenticated app screens.
When not to use: public marketing pages (except adapted version).
Variants: app, landing.
Sizes: md height, lg height.
States: default, scrolled, compact.
Responsive behavior: collapses to compact mobile top bar.
Keyboard behavior: full tab navigation.
ARIA guidance: nav landmark.
Animations: subtle shadow on scroll.
Spacing: horizontal padding per breakpoint.
Typography: type.nav.
Color tokens: surface/text/border.
Icons: search, notifications, profile.
Props: workspace, user.
Events: onWorkspaceSwitch, onSearchOpen.
Usage examples: App shell.
Do: keep controls stable.
Don’t: overload with page-specific controls.
Related components: Workspace Switcher, Global Search.

### 5.2 Sidebar

Purpose: Primary domain navigation.
Business value: rapid module switching.
Visual description: vertical grouped nav list.
When to use: app shell.
When not to use: standalone auth screens.
Variants: expanded, collapsed.
Sizes: widths sm/md.
States: default, hover, active, collapsed.
Responsive behavior: drawer on mobile.
Keyboard behavior: arrow traversal optional; tab accessible.
ARIA guidance: nav + list semantics.
Animations: collapse width transition.
Spacing: item vertical rhythm consistent.
Typography: type.nav.
Color tokens: surface/muted/active tokens.
Icons: domain icons.
Props: items, activeKey.
Events: onNavigate, onCollapse.
Usage examples: Workspace navigation.
Do: show active hierarchy.
Don’t: hide critical modules behind overflow.
Related components: Secondary Sidebar.

### 5.3 Secondary Sidebar

Purpose: Local section navigation.
Business value: deep workspace orientation.
Visual description: nested side panel.
When to use: complex modules with subroutes.
When not to use: shallow pages.
Variants: persistent, collapsible.
Sizes: narrow.
States: default, active.
Responsive behavior: convert to tabs/dropdown on small screens.
Keyboard behavior: standard nav.
ARIA guidance: nav landmark with label.
Animations: gentle slide.
Spacing: compact.
Typography: type.small/nav.
Color tokens: neutral emphasis.
Icons: optional.
Props: sections.
Events: onSectionSelect.
Usage examples: Settings categories.
Do: keep labels concise.
Don’t: duplicate primary sidebar items.
Related components: Tabs, Breadcrumbs.

### 5.4 Workspace Switcher

Purpose: Change workspace context.
Business value: cross-org productivity.
Visual description: dropdown trigger with workspace identity.
When to use: top navigation.
When not to use: anonymous pages.
Variants: compact, expanded.
Sizes: md.
States: default, open, loading.
Responsive behavior: full-screen picker mobile.
Keyboard behavior: open with Enter; list nav arrows.
ARIA guidance: button + listbox semantics.
Animations: menu reveal.
Spacing: medium.
Typography: type.nav.
Color tokens: surface/text.
Icons: workspace avatar.
Props: workspaces, currentWorkspace.
Events: onWorkspaceChange.
Usage examples: Switch business unit context.
Do: preserve last context where possible.
Don’t: switch silently on accidental hover.
Related components: Top Navigation.

### 5.5 Tabs

Purpose: Peer section switching within page scope.
Business value: keeps related content grouped.
Visual description: horizontal tab list.
When to use: sibling views.
When not to use: primary app navigation.
Variants: underline, segmented.
Sizes: sm, md.
States: default, hover, active, disabled.
Responsive behavior: scrollable tab row mobile.
Keyboard behavior: arrow nav + Enter.
ARIA guidance: tablist/tab/tabpanel roles.
Animations: active indicator slide.
Spacing: tab gap and padding.
Typography: type.nav.
Color tokens: text active/inactive + border.
Icons: optional.
Props: tabs, activeTab.
Events: onTabChange.
Usage examples: Overview vs timeline.
Do: keep tab count manageable.
Don’t: use tabs for process steps.
Related components: Segmented Control.

### 5.6 Breadcrumbs

Purpose: Hierarchical path and jump-back.
Business value: deep navigation recoverability.
Visual description: inline path with separators.
When to use: nested entity pages.
When not to use: root-level views.
Variants: standard, compact.
Sizes: sm, md.
States: default, hover link.
Responsive behavior: collapse middle nodes mobile.
Keyboard behavior: link navigation.
ARIA guidance: nav aria-label breadcrumb.
Animations: none.
Spacing: inline small gaps.
Typography: type.small.
Color tokens: muted/primary text.
Icons: separator chevron.
Props: items.
Events: onNavigate.
Usage examples: Corporate > Department > Team.
Do: use human-readable labels.
Don’t: expose technical route ids.
Related components: Page Header.

### 5.7 Pagination

Purpose: Navigate paged datasets.
Business value: scalable data browsing.
Visual description: page controls with counts.
When to use: large tables/lists.
When not to use: infinite feed views.
Variants: compact, full.
Sizes: sm, md.
States: default, disabled, active page.
Responsive behavior: compact controls mobile.
Keyboard behavior: tab + enter.
ARIA guidance: nav with page labels.
Animations: none.
Spacing: compact.
Typography: type.small.
Color tokens: border/text.
Icons: prev/next.
Props: page, pageSize, total.
Events: onPageChange.
Usage examples: Report rows.
Do: keep visible page context.
Don’t: hide total count.
Related components: Table.

### 5.8 Command Palette

Purpose: Keyboard-first command execution.
Business value: expert user speed.
Visual description: centered modal with search and command list.
When to use: global invocation.
When not to use: basic dropdown replacement.
Variants: global, context-scoped.
Sizes: md, lg.
States: closed, open, searching, empty, error.
Responsive behavior: full-screen mobile sheet.
Keyboard behavior: Cmd/Ctrl+K, arrows, Enter, Esc.
ARIA guidance: dialog + listbox semantics.
Animations: scale/fade entry.
Spacing: generous list item spacing.
Typography: type.body.s.
Color tokens: surface raised, border, text.
Icons: command icons optional.
Props: commands, recent.
Events: onCommandRun.
Usage examples: Jump to replay context.
Do: show command descriptions.
Don’t: overload with low-value commands.
Related components: Search Input, Context Menu.

### 5.9 Context Menu

Purpose: Secondary actions on object.
Business value: keeps UI uncluttered.
Visual description: right-click or long-press menu.
When to use: object-specific advanced actions.
When not to use: primary action sets.
Variants: standard.
Sizes: sm/md item heights.
States: open, hover item, disabled item.
Responsive behavior: action sheet on touch devices.
Keyboard behavior: Shift+F10 or menu key support.
ARIA guidance: menu/menuitem roles.
Animations: quick fade/slide.
Spacing: compact.
Typography: type.small.
Color tokens: surface border text.
Icons: optional per item.
Props: actions, target.
Events: onActionSelect.
Usage examples: Row actions.
Do: group destructive actions separately.
Don’t: hide crucial everyday actions exclusively here.
Related components: Dropdown Menu.

### 5.10 Dropdown Menu

Purpose: Trigger-attached action list.
Business value: action grouping.
Visual description: anchored panel list.
When to use: moderate action sets.
When not to use: command search workflows.
Variants: simple, sectioned.
Sizes: md.
States: open, hover, disabled.
Responsive behavior: bottom sheet mobile.
Keyboard behavior: arrow nav.
ARIA guidance: menu roles.
Animations: fade and translate.
Spacing: compact.
Typography: type.small.
Color tokens: surface/text/border.
Icons: optional.
Props: items.
Events: onSelect.
Usage examples: Export menu.
Do: keep labels action-oriented.
Don’t: place forms inside simple action menu.
Related components: Dropdown Button.

---

## 6. Cards

### 6.1 Standard Card

Purpose: Generic content container.
Business value: consistent information framing.
Visual description: elevated surface with header/body/footer zones.
When to use: summaries and object previews.
When not to use: long form full-page content.
Variants: default, interactive.
Sizes: sm, md, lg.
States: default, hover, selected, disabled.
Responsive behavior: stack in single column mobile.
Keyboard behavior: focusable if clickable.
ARIA guidance: article/group semantics.
Animations: hover elevation.
Spacing: padding space.5 default.
Typography: heading + body tokens.
Color tokens: surface/border/text.
Icons: optional header icon.
Props: title, actions.
Events: onClick.
Usage examples: Insight summary.
Do: keep card purpose singular.
Don’t: overload with unrelated controls.
Related components: Metric Card.

### 6.2 Analytics Card

Purpose: Display chart with context.
Business value: fast trend interpretation.
Visual description: metric + mini chart + delta.
When to use: dashboard KPIs.
When not to use: detailed analysis pages requiring full chart.
Variants: trend, comparison.
Sizes: md, lg.
States: default, loading, error, empty.
Responsive behavior: chart simplification mobile.
Keyboard behavior: focus and tooltip access.
ARIA guidance: text summary fallback for chart.
Animations: subtle chart draw.
Spacing: structured content regions.
Typography: metric + caption.
Color tokens: brand + neutral.
Icons: trend arrows optional.
Props: value, delta, series.
Events: onCardOpen.
Usage examples: Signal velocity.
Do: include timeframe label.
Don’t: hide axis context.
Related components: Line Chart, Metric Card.

### 6.3 Metric Card

Purpose: Single KPI display.
Business value: snapshot decision support.
Visual description: label, value, delta.
When to use: top-level metrics.
When not to use: multi-dimensional data.
Variants: positive, warning, neutral.
Sizes: sm, md.
States: default, loading, unavailable.
Responsive behavior: stable numeric sizing.
Keyboard behavior: optional link activation.
ARIA guidance: announce value + period.
Animations: delta color fade.
Spacing: compact.
Typography: type.h3/value emphasis.
Color tokens: text + semantic.
Icons: optional indicator.
Props: label, value, delta.
Events: onClick optional.
Usage examples: Revenue run-rate.
Do: show baseline period.
Don’t: show delta without reference.
Related components: Analytics Card.

### 6.4 Insight Card

Purpose: Highlight AI-derived insight.
Business value: directs attention to high-impact findings.
Visual description: insight statement, confidence, action.
When to use: insights feed.
When not to use: raw metric display.
Variants: highImpact, emerging.
Sizes: md, lg.
States: default, acknowledged.
Responsive behavior: compact summary mobile.
Keyboard behavior: card actions tab-accessible.
ARIA guidance: sections announced clearly.
Animations: entry reveal.
Spacing: generous text spacing.
Typography: heading/body.
Color tokens: surface + brand accents.
Icons: insight marker.
Props: summary, confidence.
Events: onAcknowledge, onOpen.
Usage examples: Opportunity insight.
Do: include evidence link.
Don’t: present without confidence context.
Related components: Recommendation Panel.

### 6.5 AI Recommendation Card

Purpose: Recommendation with rationale and action.
Business value: decision acceleration.
Visual description: recommendation, why, confidence, actions.
When to use: executive and operations queues.
When not to use: generic notifications.
Variants: approveRequired, autoExecutable.
Sizes: md, lg.
States: pending, approved, rejected, expired.
Responsive behavior: action buttons stacked mobile.
Keyboard behavior: full actionable controls.
ARIA guidance: status and confidence announced.
Animations: state change transitions.
Spacing: structured sections.
Typography: heading/body/small.
Color tokens: semantic + brand.
Icons: confidence/status.
Props: recommendationId, status.
Events: onApprove, onReject, onViewDetails.
Usage examples: Prioritize account outreach.
Do: provide alternatives.
Don’t: hide downside risk.
Related components: Decision Viewer.

### 6.6 Customer Card

Purpose: Customer summary with health context.
Business value: account prioritization.
Visual description: identity, segment, health, risk tags.
When to use: customer lists and dashboards.
When not to use: detailed account page primary content.
Variants: compact, detailed.
Sizes: sm, md, lg.
States: default, atRisk, healthy.
Responsive behavior: condensed identity block mobile.
Keyboard behavior: card open action.
ARIA guidance: customer name and health announced.
Animations: health indicator transition.
Spacing: medium.
Typography: body + small metadata.
Color tokens: neutral + semantic.
Icons: health status.
Props: customerId, healthScore.
Events: onOpenCustomer.
Usage examples: At-risk customer queue.
Do: surface latest meaningful signal.
Don’t: bury risk reason.
Related components: Client Card.

### 6.7 Agent Card

Purpose: Agent runtime summary.
Business value: operational observability.
Visual description: agent role, status, queue, last outcome.
When to use: agents workspace.
When not to use: non-agent modules.
Variants: active, idle, degraded.
Sizes: md, lg.
States: healthy, warning, error.
Responsive behavior: stacked metrics mobile.
Keyboard behavior: open details action.
ARIA guidance: status announced.
Animations: status pulse restrained.
Spacing: medium.
Typography: body + metric.
Color tokens: semantic statuses.
Icons: agent/state icons.
Props: agentId, status.
Events: onOpenAgent.
Usage examples: Agent fleet monitor.
Do: include last execution timestamp.
Don’t: hide failure states.
Related components: Agent Status, Action Queue.

### 6.8 Executive Summary Card

Purpose: Strategic summary snapshot.
Business value: executive decision support.
Visual description: headline finding with implications.
When to use: executive workspace and reports.
When not to use: low-level operational views.
Variants: briefing, decision-ready.
Sizes: lg, xl.
States: default, updated.
Responsive behavior: summarize text on mobile.
Keyboard behavior: expandable details.
ARIA guidance: heading hierarchy.
Animations: gentle update highlight.
Spacing: large whitespace.
Typography: display/body.
Color tokens: brand text + neutral.
Icons: optional strategic indicator.
Props: headline, implications.
Events: onOpenBriefing.
Usage examples: Weekly executive brief.
Do: keep concise and high-value.
Don’t: overload with raw metrics.
Related components: Insight Card.

### 6.9 Notification Card

Purpose: Persistent actionable notification unit.
Business value: triage and response.
Visual description: status stripe, message, action.
When to use: inbox and alert panels.
When not to use: transient toasts.
Variants: info, warning, error, success.
Sizes: md.
States: unread, read, archived.
Responsive behavior: full-width mobile list.
Keyboard behavior: open and mark actions accessible.
ARIA guidance: priority announced.
Animations: unread badge fade.
Spacing: compact.
Typography: body small.
Color tokens: semantic by priority.
Icons: priority icon.
Props: priority, message.
Events: onOpen, onDismiss.
Usage examples: Approval required alert.
Do: include timestamp.
Don’t: use vague titles.
Related components: Toast, Alert Banner.

### 6.10 Timeline Card

Purpose: Event-by-event context item.
Business value: traceability and replay clarity.
Visual description: timestamp, event type, summary.
When to use: replay and activity feeds.
When not to use: static summaries.
Variants: compact, detailed payload.
Sizes: sm, md.
States: default, selected, expanded.
Responsive behavior: condensed metadata mobile.
Keyboard behavior: expand/collapse via Enter.
ARIA guidance: listitem with time semantics.
Animations: expand/collapse motion.
Spacing: compact vertical rhythm.
Typography: small/body.
Color tokens: neutral + event semantic.
Icons: event type icon.
Props: eventId, contextId, eventType.
Events: onExpand, onJumpToRelated.
Usage examples: Context replay list.
Do: preserve chronological order.
Don’t: hide timestamp precision.
Related components: Execution Timeline.

---

## 7. Tables

### 7.1 Enterprise Table

Purpose: Primary data table for business records.
Business value: high-throughput analysis and action.
Visual description: robust grid with toolbar and row actions.
When to use: most operational datasets.
When not to use: very small data sets where cards are clearer.
Variants: default, selectable.
Sizes: compact, regular.
States: loading, populated, empty, error.
Responsive behavior: column prioritization + overflow strategy.
Keyboard behavior: row navigation and action triggers.
ARIA guidance: table semantics with sortable headers.
Animations: minimal row highlight updates.
Spacing: row density tokens.
Typography: table header/cell tokens.
Color tokens: surface/border/text.
Icons: sort/filter/action icons.
Props: columns, rows, sorting, filters.
Events: onSort, onFilter, onRowSelect.
Usage examples: Recommendations list.
Do: keep sticky header for long lists.
Don’t: mix unrelated row action patterns.
Related components: Pagination, Filter Bar.

### 7.2 Compact Table

Purpose: Dense data display.
Business value: maximizes visible records.
Visual description: reduced row height table.
When to use: monitoring screens for expert users.
When not to use: novice-heavy workflows.
Variants: readOnly.
Sizes: compact only.
States: standard table states.
Responsive behavior: switch to standard density below laptop.
Keyboard behavior: same as enterprise table.
ARIA guidance: same as enterprise table.
Animations: minimal.
Spacing: compact.
Typography: type.small/table.
Color tokens: neutral.
Icons: minimal.
Props: density fixed compact.
Events: same as enterprise table.
Usage examples: Event logs.
Do: preserve readability.
Don’t: use compact on mobile.
Related components: Enterprise Table.

### 7.3 Tree Table

Purpose: Hierarchical data in tabular format.
Business value: org/project structure visibility.
Visual description: expandable parent-child rows.
When to use: nested business entities.
When not to use: flat datasets.
Variants: selectable, readOnly.
Sizes: regular.
States: expanded, collapsed, partial selection.
Responsive behavior: collapse to tree list mobile.
Keyboard behavior: arrow expand/collapse.
ARIA guidance: treegrid roles.
Animations: row expand transitions.
Spacing: indentation tokens.
Typography: table tokens.
Color tokens: neutral + selection.
Icons: chevrons.
Props: rowTree.
Events: onToggleRow.
Usage examples: Department structure.
Do: show depth clearly.
Don’t: hide children count.
Related components: Tree Selector.

### 7.4 Grouped Table

Purpose: Group rows by shared dimension.
Business value: faster pattern detection.
Visual description: group headers with collapsible sections.
When to use: grouped analysis by owner/status.
When not to use: highly sparse data.
Variants: groupedByOne, groupedByTwo.
Sizes: regular.
States: groups expanded/collapsed.
Responsive behavior: reduce group depth mobile.
Keyboard behavior: group collapse toggle.
ARIA guidance: grouped row semantics.
Animations: collapse transitions.
Spacing: group header spacing.
Typography: group labels emphasis.
Color tokens: subtle bg for group headers.
Icons: collapse indicators.
Props: groupBy.
Events: onGroupToggle.
Usage examples: Tasks by priority.
Do: keep group label meaningful.
Don’t: over-nest groups.
Related components: Enterprise Table.

### 7.5 Editable Table

Purpose: Inline tabular editing.
Business value: high-speed batch updates.
Visual description: editable cells with validation.
When to use: operational data maintenance.
When not to use: highly complex form logic per row.
Variants: cellEdit, rowEdit.
Sizes: regular.
States: viewing, editing, saving, error.
Responsive behavior: row edit drawer on mobile.
Keyboard behavior: Enter edit, Esc cancel, Tab next cell.
ARIA guidance: editable grid semantics.
Animations: edit state highlight.
Spacing: standard table.
Typography: table/form tokens.
Color tokens: focus/error states.
Icons: edit/save/cancel.
Props: editableColumns.
Events: onCellCommit, onRowCommit.
Usage examples: Update thresholds.
Do: provide undo path.
Don’t: autosave destructive edits without confirmation.
Related components: Form Inputs.

### 7.6 Data Grid

Purpose: Advanced analytical grid behavior.
Business value: enterprise power-user operations.
Visual description: virtualized, pinning, resizing capable grid.
When to use: large datasets and complex analysis.
When not to use: small simple tables.
Variants: analytic, operational.
Sizes: regular/compact.
States: loading, virtualized scrolling, selected.
Responsive behavior: restricted features mobile.
Keyboard behavior: full grid navigation.
ARIA guidance: grid semantics and shortcuts help.
Animations: minimal for performance.
Spacing: data-dense tokens.
Typography: table tokens.
Color tokens: neutral emphasis.
Icons: grid tools.
Props: virtualization, pinnedColumns.
Events: onSelectionChange, onColumnResize.
Usage examples: Event payload analytics.
Do: provide clear keyboard help.
Don’t: enable all advanced controls by default.
Related components: Enterprise Table.

### 7.7 Comparison Table

Purpose: Side-by-side attribute comparison.
Business value: decision tradeoff clarity.
Visual description: column-based compare layout.
When to use: option/recommendation evaluations.
When not to use: transactional row lists.
Variants: two-way, multi-way.
Sizes: md, lg.
States: default, highlighted differences.
Responsive behavior: horizontal scroll with sticky row labels.
Keyboard behavior: standard table nav.
ARIA guidance: header associations critical.
Animations: diff highlight fade.
Spacing: generous for readability.
Typography: heading + body.
Color tokens: neutral + diff highlights.
Icons: optional diff markers.
Props: comparedItems.
Events: onSelectWinner.
Usage examples: Scenario comparison.
Do: emphasize key differences.
Don’t: bury decision criteria.
Related components: Decision Viewer.

---

## 8. Charts

### 8.1 Line Chart

Purpose: Trend over time.
Business value: trajectory understanding.
Visual description: continuous line with optional confidence band.
When to use: temporal metrics.
When not to use: part-to-whole composition.
Variants: singleSeries, multiSeries.
Sizes: sm, md, lg.
States: loading, empty, error.
Responsive behavior: reduce ticks on mobile.
Keyboard behavior: focusable data points.
ARIA guidance: textual summary required.
Animations: initial draw subtle.
Spacing: chart padding with axis labels.
Typography: type.small for labels.
Color tokens: brand/neutral series tokens.
Icons: n/a.
Props: series, xAxis, yAxis.
Events: onPointHover, onPointSelect.
Usage examples: Signal trend.
Do: include timeframe and units.
Don’t: overplot too many series.
Related components: Sparkline.

### 8.2 Bar Chart

Purpose: Category comparison.
Business value: relative magnitude clarity.
Visual description: vertical or horizontal bars.
When to use: grouped category values.
When not to use: high-frequency time series.
Variants: grouped, stacked.
Sizes: md, lg.
States: loading, empty.
Responsive behavior: horizontal bars for narrow widths.
Keyboard behavior: bar focus navigation.
ARIA guidance: list summary fallback.
Animations: bar grow entrance.
Spacing: category gaps consistent.
Typography: small labels.
Color tokens: category palette within brand rules.
Icons: n/a.
Props: categories, values.
Events: onBarSelect.
Usage examples: Pipeline by stage.
Do: sort for readability.
Don’t: use too many colors.
Related components: Comparison Table.

### 8.3 Area Chart

Purpose: Trend with magnitude emphasis.
Business value: cumulative pattern visibility.
Visual description: filled area under line.
When to use: total volume over time.
When not to use: many overlapping series.
Variants: single, stacked.
Sizes: md, lg.
States: standard chart states.
Responsive behavior: simplify fill effects mobile.
Keyboard behavior: same as line chart.
ARIA guidance: summary text.
Animations: subtle fill reveal.
Spacing: chart standard.
Typography: label small.
Color tokens: blue tints.
Icons: n/a.
Props: series.
Events: onPointSelect.
Usage examples: Event volume trend.
Do: maintain sufficient contrast.
Don’t: hide baseline.
Related components: Line Chart.

### 8.4 Pie Chart

Purpose: Part-to-whole breakdown.
Business value: quick proportion glance.
Visual description: circular segmented chart.
When to use: few categories (2 to 6).
When not to use: many small slices.
Variants: labeled, legend-based.
Sizes: sm, md.
States: standard.
Responsive behavior: switch to bar chart for tiny screens with many labels.
Keyboard behavior: segment focus.
ARIA guidance: percent summary list.
Animations: segment reveal mild.
Spacing: preserve label clearance.
Typography: small labels.
Color tokens: limited categorical palette.
Icons: n/a.
Props: segments.
Events: onSegmentSelect.
Usage examples: Workload distribution.
Do: limit category count.
Don’t: use for precise comparisons.
Related components: Donut Chart.

### 8.5 Donut Chart

Purpose: Part-to-whole with center metric.
Business value: combines ratio + headline value.
Visual description: pie with hollow center.
When to use: progress and composition.
When not to use: too many categories.
Variants: singleMetricCenter, multiSegment.
Sizes: sm, md, lg.
States: standard.
Responsive behavior: simplify labels mobile.
Keyboard behavior: segment navigation.
ARIA guidance: center metric announced.
Animations: ring draw.
Spacing: legend spacing.
Typography: center metric emphasis.
Color tokens: semantic/brand palette.
Icons: optional center icon.
Props: value, segments.
Events: onSegmentSelect.
Usage examples: Completion ratio.
Do: keep center text concise.
Don’t: overload with dense legend.
Related components: Progress Chart.

### 8.6 Heatmap

Purpose: Intensity distribution across matrix.
Business value: pattern detection across dimensions.
Visual description: color-coded cell grid.
When to use: volume and activity density.
When not to use: exact value communication without tooltip.
Variants: calendar, matrix.
Sizes: md, lg.
States: loading, empty.
Responsive behavior: reduced resolution mobile.
Keyboard behavior: cell focus.
ARIA guidance: values announced on focus.
Animations: none heavy.
Spacing: cell gap minimal.
Typography: axis labels small.
Color tokens: accessible gradient scale.
Icons: n/a.
Props: matrixValues.
Events: onCellSelect.
Usage examples: Activity intensity.
Do: include legend.
Don’t: rely only on color.
Related components: Timeline Chart.

### 8.7 Timeline Chart

Purpose: Event sequence visualization.
Business value: causality and chronology analysis.
Visual description: horizontal or vertical temporal markers.
When to use: replay and execution history.
When not to use: aggregated non-temporal metrics.
Variants: compact, detailed.
Sizes: md, lg.
States: loading, empty, selected event.
Responsive behavior: vertical timeline mobile.
Keyboard behavior: event navigation keys.
ARIA guidance: chronological list semantics.
Animations: cursor and scrub transitions.
Spacing: event density controls.
Typography: small labels.
Color tokens: event type semantic tokens.
Icons: event markers.
Props: events, timeRange.
Events: onEventSelect, onRangeChange.
Usage examples: Context replay.
Do: show precise timestamps.
Don’t: reorder events visually.
Related components: Replay Timeline.

### 8.8 Progress Chart

Purpose: Completion progress.
Business value: task/program status clarity.
Visual description: linear or circular progress indication.
When to use: finite completion tracking.
When not to use: open-ended trend metrics.
Variants: linear, radial.
Sizes: sm, md, lg.
States: inProgress, complete, stalled.
Responsive behavior: linear preferred mobile.
Keyboard behavior: focus for status readout.
ARIA guidance: role progressbar with values.
Animations: smooth progress increments.
Spacing: compact.
Typography: caption labels.
Color tokens: success/info tokens.
Icons: optional check.
Props: value, max.
Events: none/optional onClick.
Usage examples: Workflow completion.
Do: show numeric percent with progress.
Don’t: animate indefinitely without reason.
Related components: Gauge Chart.

### 8.9 Gauge Chart

Purpose: Threshold-based status gauge.
Business value: quick health/risk indication.
Visual description: arc with pointer/value zone.
When to use: bounded risk or confidence indexes.
When not to use: detailed trend analysis.
Variants: half, full gauge.
Sizes: md, lg.
States: low, medium, high zones.
Responsive behavior: compact simplified gauge mobile.
Keyboard behavior: focus for value read.
ARIA guidance: text equivalent mandatory.
Animations: pointer transitions.
Spacing: medium.
Typography: metric + label.
Color tokens: semantic zones.
Icons: optional zone markers.
Props: value, ranges.
Events: optional onZoneClick.
Usage examples: Risk index.
Do: include numeric value.
Don’t: rely on color alone.
Related components: Progress Chart, Confidence Indicator.

### 8.10 Sparkline

Purpose: Mini trend indicator.
Business value: compact trend context in cards/tables.
Visual description: tiny line chart without heavy axes.
When to use: KPI cards and row-level trend.
When not to use: primary analytical visualization.
Variants: line, area.
Sizes: xs, sm.
States: default.
Responsive behavior: hide on very small cells.
Keyboard behavior: optional tooltip focus.
ARIA guidance: provide text trend summary.
Animations: subtle draw.
Spacing: inline.
Typography: n/a.
Color tokens: brand/semantic trends.
Icons: n/a.
Props: values.
Events: onHover optional.
Usage examples: 7-day trend.
Do: keep minimal and readable.
Don’t: overcrowd tiny sparkline with many points.
Related components: Metric Card.

---

## 9. AI Components

### 9.1 Prompt Composer

Purpose: Compose and submit structured AI requests.
Business value: improves prompt quality and execution outcomes.
Visual description: multiline input with context selectors and action controls.
When to use: AI task initiation.
When not to use: plain chat-only quick replies.
Variants: compact, advanced.
Sizes: md, lg.
States: idle, composing, submitting, blocked.
Responsive behavior: bottom-docked mobile composer.
Keyboard behavior: submit shortcut and multiline toggle.
ARIA guidance: clear label for context scope and submit.
Animations: send and pending transitions.
Spacing: generous.
Typography: form input/body.
Color tokens: surface raised + brand action.
Icons: send, attach, context.
Props: prompt, context, toolsAllowed.
Events: onSubmit.
Usage examples: Ask for replay diagnosis.
Do: show model/context summary.
Don’t: hide execution permissions.
Related components: AI Prompt Input, Conversation Panel.

### 9.2 Conversation Panel

Purpose: Display threaded AI interactions.
Business value: continuity and explainable dialogue.
Visual description: chronological messages with role styling.
When to use: AI assistant workflows.
When not to use: static report pages.
Variants: full, sidePanel.
Sizes: md, lg, xl.
States: loadingHistory, streaming, error.
Responsive behavior: full-page mode on mobile.
Keyboard behavior: message navigation and composer focus shortcuts.
ARIA guidance: live region for streaming updates.
Animations: message enter subtle.
Spacing: message rhythm.
Typography: body and small metadata.
Color tokens: neutral + brand accents.
Icons: role indicators.
Props: messages, streaming.
Events: onSend, onRetry.
Usage examples: Agent conversation log.
Do: preserve source references.
Don’t: auto-scroll aggressively during user review.
Related components: Prompt Composer, Reasoning Viewer.

### 9.3 Execution Timeline

Purpose: Visualize runtime steps.
Business value: execution transparency and debugging.
Visual description: ordered step list with statuses.
When to use: agent and workflow runs.
When not to use: high-level dashboard summaries.
Variants: compact, detailed.
Sizes: md, lg.
States: pending, running, complete, failed.
Responsive behavior: condensed mobile timeline.
Keyboard behavior: expand step details.
ARIA guidance: status announcements.
Animations: step progression updates.
Spacing: vertical timeline spacing.
Typography: small/body.
Color tokens: semantic status.
Icons: step status icons.
Props: steps.
Events: onStepSelect.
Usage examples: Workflow execution trace.
Do: include timestamps.
Don’t: hide failed step reasons.
Related components: Timeline Card, Replay Timeline.

### 9.4 Reasoning Viewer

Purpose: Explain recommendation logic.
Business value: trust and compliance.
Visual description: sections for observation, evidence, reasoning, confidence.
When to use: decision-critical recommendations.
When not to use: trivial informational outputs.
Variants: inline, modal.
Sizes: md, lg, xl.
States: available, partial, unavailable.
Responsive behavior: collapsible sections mobile.
Keyboard behavior: section expand/collapse.
ARIA guidance: heading hierarchy.
Animations: section reveal.
Spacing: content-first whitespace.
Typography: body + small labels.
Color tokens: neutral text + info accents.
Icons: evidence/confidence markers.
Props: explanationModel.
Events: onOpenSource.
Usage examples: Why this action is recommended.
Do: keep chain explicit.
Don’t: present opaque confidence values.
Related components: Recommendation Panel, Decision Viewer.

### 9.5 Memory Timeline

Purpose: Display memory objects/events by context.
Business value: institutional memory retrieval.
Visual description: filterable chronological timeline.
When to use: memory workspace and audits.
When not to use: immediate action-only views.
Variants: context scoped, global.
Sizes: md, lg.
States: loading, replaying, empty.
Responsive behavior: compact cards mobile.
Keyboard behavior: timeline event navigation.
ARIA guidance: list semantics and time labels.
Animations: playback cursor movement.
Spacing: event spacing by density mode.
Typography: small/body.
Color tokens: neutral + semantic event.
Icons: event type icons.
Props: contextId, filters.
Events: onEventSelect.
Usage examples: Replay decisions across time.
Do: allow time-range filter.
Don’t: hide source linkage.
Related components: Replay Timeline, Event Viewer.

### 9.6 Replay Timeline

Purpose: Interactive replay of context execution.
Business value: debugging and explainability.
Visual description: scrubber + event sequence + detail panel.
When to use: replay contexts.
When not to use: static activity feed.
Variants: simple, debug.
Sizes: lg, xl.
States: idle, playing, paused, ended.
Responsive behavior: control simplification mobile.
Keyboard behavior: play/pause/step shortcuts.
ARIA guidance: control labels and timeline value.
Animations: playback transitions.
Spacing: split-layout spacing.
Typography: body/small metadata.
Color tokens: timeline + semantic statuses.
Icons: playback controls.
Props: timelineData.
Events: onPlay, onPause, onSeek.
Usage examples: Incident replay.
Do: keep deterministic ordering.
Don’t: auto-play without user intent.
Related components: Execution Timeline, Memory Timeline.

### 9.7 Agent Status

Purpose: Display real-time agent health and activity.
Business value: operational governance.
Visual description: status chip/card with metrics.
When to use: agents and admin surfaces.
When not to use: non-agent pages.
Variants: compact badge, detailed panel.
Sizes: sm, md, lg.
States: healthy, busy, degraded, offline.
Responsive behavior: badge-only mobile where needed.
Keyboard behavior: details open via Enter.
ARIA guidance: status text announced.
Animations: heartbeat pulse only when running.
Spacing: compact to medium.
Typography: small/body.
Color tokens: semantic status.
Icons: status dot/icon.
Props: status, lastSeen.
Events: onOpenDetails.
Usage examples: Agent fleet overview.
Do: include last update timestamp.
Don’t: rely only on color.
Related components: Agent Card.

### 9.8 Confidence Indicator

Purpose: Convey confidence level with explanation hook.
Business value: decision calibration.
Visual description: labeled badge/bar with tooltip detail.
When to use: recommendations and predictions.
When not to use: deterministic binary system states.
Variants: low/medium/high, numeric+label.
Sizes: sm, md.
States: default, expanded detail.
Responsive behavior: inline compact mobile.
Keyboard behavior: tooltip focus trigger.
ARIA guidance: confidence text included.
Animations: subtle fill transition.
Spacing: inline.
Typography: small.
Color tokens: semantic + neutral.
Icons: optional confidence glyph.
Props: confidenceLevel, confidenceScore.
Events: onViewMethod.
Usage examples: Recommendation confidence.
Do: pair with rationale source.
Don’t: show isolated percent without meaning.
Related components: Reasoning Viewer.

### 9.9 Recommendation Panel

Purpose: Full recommendation workspace panel.
Business value: prioritization and action execution.
Visual description: list + details + actions.
When to use: executive/operations workflows.
When not to use: tiny card-only contexts.
Variants: queue, detail-first.
Sizes: lg, xl.
States: loading, filtered, empty.
Responsive behavior: list/detail stacked mobile.
Keyboard behavior: list navigation + action shortcuts.
ARIA guidance: panel landmarks.
Animations: item selection transitions.
Spacing: spacious.
Typography: heading/body.
Color tokens: neutral + semantic highlights.
Icons: category and status icons.
Props: recommendations.
Events: onSelectRecommendation, onAction.
Usage examples: Approval queue.
Do: sort by impact.
Don’t: hide reasons behind extra clicks.
Related components: AI Recommendation Card, Decision Viewer.

### 9.10 Decision Viewer

Purpose: Review and confirm decision outcomes.
Business value: accountability and traceability.
Visual description: decision summary, rationale, approval history.
When to use: final decision checkpoints.
When not to use: early exploratory analysis.
Variants: readOnly, approver.
Sizes: lg.
States: pending, approved, rejected, revised.
Responsive behavior: collapsible sections mobile.
Keyboard behavior: action controls keyboard-first.
ARIA guidance: status and history semantics.
Animations: state badge transition.
Spacing: medium/large.
Typography: heading/body/small.
Color tokens: semantic decision statuses.
Icons: approval/rejection icons.
Props: decisionRecord.
Events: onApprove, onReject, onRequestRevision.
Usage examples: Executive approval.
Do: show decision timeline.
Don’t: allow silent status changes.
Related components: Recommendation Panel.

### 9.11 Action Queue

Purpose: Queue of pending/running AI and workflow actions.
Business value: operation control and intervention.
Visual description: lane/list with statuses and controls.
When to use: automation and operations monitoring.
When not to use: static report pages.
Variants: compact queue, board lanes.
Sizes: md, lg.
States: pending, running, blocked, completed, failed.
Responsive behavior: list mode mobile.
Keyboard behavior: select and act via keyboard.
ARIA guidance: queue status announcements.
Animations: item movement transitions.
Spacing: medium.
Typography: body/small.
Color tokens: semantic statuses.
Icons: status and action icons.
Props: queueItems.
Events: onPause, onResume, onCancel, onRetry.
Usage examples: Workflow queue control.
Do: show SLA/age indicators.
Don’t: hide blocked reason.
Related components: Execution Timeline, Agent Status.

---

## 10. Notifications

### 10.1 Toast

Purpose: Transient non-blocking feedback.
Business value: confirms user actions quickly.
Visual description: floating message with optional action.
When to use: success/info confirmations.
When not to use: critical unresolved errors.
Variants: success, info, warning, error.
Sizes: md.
States: visible, dismissing.
Responsive behavior: bottom stack mobile.
Keyboard behavior: dismiss action focusable.
ARIA guidance: polite live region.
Animations: fade/slide.
Spacing: compact.
Typography: small/body.
Color tokens: semantic.
Icons: variant icon.
Props: title, message, action.
Events: onDismiss.
Usage examples: Settings saved.
Do: auto-dismiss non-critical toasts.
Don’t: stack too many simultaneously.
Related components: Banner, Alert.

### 10.2 Banner

Purpose: Inline page-level notice.
Business value: persistent visibility for contextual issues.
Visual description: horizontal full-width strip.
When to use: workspace-wide alerts.
When not to use: tiny local field errors.
Variants: info, warning, error, success.
Sizes: md.
States: shown, dismissed.
Responsive behavior: wraps text mobile.
Keyboard behavior: dismiss button accessible.
ARIA guidance: role status/alert based on severity.
Animations: slide-in subtle.
Spacing: medium.
Typography: body.s.
Color tokens: semantic background tokens.
Icons: semantic icon.
Props: message, actions.
Events: onDismiss.
Usage examples: Sync degraded mode.
Do: include remediation action.
Don’t: overuse as persistent clutter.
Related components: Alert.

### 10.3 Alert

Purpose: High-importance message block.
Business value: risk awareness.
Visual description: bordered callout with title and details.
When to use: actionable errors/warnings.
When not to use: routine confirmations.
Variants: critical, warning, info.
Sizes: md, lg.
States: active, resolved.
Responsive behavior: action buttons stack mobile.
Keyboard behavior: controls keyboard accessible.
ARIA guidance: role alert for urgent.
Animations: none heavy.
Spacing: medium.
Typography: heading + body.
Color tokens: semantic.
Icons: required.
Props: title, description.
Events: onAction.
Usage examples: Approval timeout risk.
Do: keep action clear.
Don’t: use verbose technical jargon only.
Related components: Banner, Notification Card.

### 10.4 Success Notification

Purpose: Positive completion signal.
Business value: closes user intent loop.
Visual description: green-accented message.
When to use: completed actions.
When not to use: warnings/errors.
Variants: toast, inline.
Sizes: sm, md.
States: shown, dismissed.
Responsive behavior: standard.
Keyboard behavior: dismiss focusable.
ARIA guidance: polite live region.
Animations: gentle appear.
Spacing: compact.
Typography: body.s.
Color tokens: color.semantic.success.*
Icons: check.
Props: message.
Events: onDismiss.
Usage examples: Workflow approved.
Do: mention what succeeded.
Don’t: use generic “Done”.
Related components: Toast.

### 10.5 Error Notification

Purpose: Error communication and recovery.
Business value: reduces failure ambiguity.
Visual description: red-accented message with retry/help actions.
When to use: operation failures.
When not to use: warnings.
Variants: toast, banner, alert.
Sizes: sm, md, lg.
States: shown, retried, resolved.
Responsive behavior: full-width on mobile.
Keyboard behavior: retry action accessible.
ARIA guidance: assertive region for blocking errors.
Animations: none distracting.
Spacing: compact/medium.
Typography: body.s.
Color tokens: semantic error tokens.
Icons: error icon.
Props: errorCode, message.
Events: onRetry, onDismiss.
Usage examples: Save failed.
Do: provide recovery path.
Don’t: expose raw stack traces to end users.
Related components: Retry State.

### 10.6 Warning Notification

Purpose: Caution before risk increases.
Business value: proactive risk handling.
Visual description: amber-accented message.
When to use: non-fatal issues needing attention.
When not to use: success/info.
Variants: toast, inline.
Sizes: sm, md.
States: shown, acknowledged.
Responsive behavior: standard.
Keyboard behavior: action button accessible.
ARIA guidance: status region.
Animations: subtle entry.
Spacing: compact.
Typography: body.s.
Color tokens: warning tokens.
Icons: warning icon.
Props: message, action.
Events: onAcknowledge.
Usage examples: Token expiring soon.
Do: include urgency context.
Don’t: use vague warnings.
Related components: Banner.

### 10.7 Inbox Notification

Purpose: Persistent triage item in notification center.
Business value: asynchronous attention management.
Visual description: list item with priority, source, time, actions.
When to use: events requiring later follow-up.
When not to use: immediate ephemeral feedback.
Variants: read, unread, pinned.
Sizes: md.
States: unread/read/archived.
Responsive behavior: compact list mobile.
Keyboard behavior: list and action navigation.
ARIA guidance: listitem semantics.
Animations: unread indicator transitions.
Spacing: list rhythm.
Typography: small/body.
Color tokens: neutral + semantic markers.
Icons: priority indicators.
Props: priority, source, timestamp.
Events: onOpen, onArchive.
Usage examples: New recommendation available.
Do: support filters.
Don’t: mix unrelated event formats.
Related components: Notification Card.

### 10.8 Realtime Event Notification

Purpose: Surface live high-value runtime events.
Business value: immediate operational awareness.
Visual description: compact live event capsule.
When to use: critical real-time updates.
When not to use: low-priority routine updates.
Variants: inline feed, overlay pulse.
Sizes: sm, md.
States: new, acknowledged.
Responsive behavior: stack in live panel mobile.
Keyboard behavior: accessible open/ack.
ARIA guidance: live region with throttle.
Animations: minimal pulse.
Spacing: compact.
Typography: small.
Color tokens: semantic by priority.
Icons: live indicator dot.
Props: eventType, severity.
Events: onAcknowledge, onOpenContext.
Usage examples: Workflow failure live alert.
Do: throttle bursts.
Don’t: spam with low-value events.
Related components: Activity Feed.

---

## 11. Feedback Components

### 11.1 Loading Spinner

Purpose: indicate active processing.
Business value: communicates non-idle system state.
Visual description: circular rotating indicator.
When to use: short unknown waits.
When not to use: known layout loading.
Variants: inline, overlay.
Sizes: sm, md, lg.
States: spinning.
Responsive behavior: centered within container.
Keyboard behavior: non-interactive.
ARIA guidance: role status with loading text.
Animations: rotate only.
Spacing: surrounding breathing room.
Typography: optional caption.
Color tokens: brand/neutral.
Icons: spinner glyph.
Props: label.
Events: none.
Usage examples: Fetching report.
Do: include descriptive text for long waits.
Don’t: use alone for long skeleton-appropriate surfaces.
Related components: Skeleton.

### 11.2 Skeleton

Purpose: placeholder for known structures.
Business value: perceived performance and stability.
Visual description: animated neutral blocks matching layout.
When to use: card/table/content loading.
When not to use: unknown structure tiny waits.
Variants: text, card, table-row, avatar.
Sizes: context-driven.
States: loading.
Responsive behavior: match final responsive layout.
Keyboard behavior: non-interactive.
ARIA guidance: ariaHidden on decorative skeleton; status text elsewhere.
Animations: shimmer subtle or pulse.
Spacing: mirrors final UI.
Typography: n/a.
Color tokens: neutral 100/200.
Icons: n/a.
Props: lines, shape.
Events: none.
Usage examples: Dashboard loading.
Do: mirror actual content form.
Don’t: show generic skeleton for specific layouts.
Related components: Loading Spinner.

### 11.3 Progress Bar

Purpose: show quantified progress.
Business value: user confidence during longer tasks.
Visual description: linear bar with optional percentage.
When to use: upload, workflow progress.
When not to use: unknown duration tasks.
Variants: determinate, indeterminate.
Sizes: sm, md.
States: active, complete, error.
Responsive behavior: full-width mobile.
Keyboard behavior: non-interactive by default.
ARIA guidance: role progressbar + ariaValue.
Animations: fill transition.
Spacing: compact.
Typography: caption for label.
Color tokens: brand/success/error.
Icons: optional complete icon.
Props: value, max, label.
Events: none.
Usage examples: Export progress.
Do: provide ETA where possible.
Don’t: fake determinate percentages.
Related components: Loading Spinner.

### 11.4 Empty State

Purpose: explain no-data state and next action.
Business value: prevents dead-end experience.
Visual description: icon/illustration + text + CTA.
When to use: empty lists, first-run views.
When not to use: temporary loading.
Variants: firstUse, filteredEmpty.
Sizes: md, lg.
States: default.
Responsive behavior: compact copy mobile.
Keyboard behavior: CTA focusable.
ARIA guidance: heading and supportive text structure.
Animations: subtle entrance.
Spacing: generous whitespace.
Typography: heading + body.
Color tokens: neutral + subtle accent.
Icons: contextual empty icon.
Props: title, description, cta.
Events: onCtaClick.
Usage examples: No recommendations yet.
Do: explain why empty.
Don’t: use generic “No data”.
Related components: Error State, Retry State.

### 11.5 Offline State

Purpose: communicate disconnected mode.
Business value: prevents mistaken assumptions about freshness.
Visual description: persistent status banner/panel.
When to use: network unavailable or sync disabled.
When not to use: transient API hiccups alone.
Variants: global banner, local panel.
Sizes: md.
States: offline, reconnecting, restored.
Responsive behavior: sticky top mobile.
Keyboard behavior: retry reachable.
ARIA guidance: assertive update for state changes.
Animations: reconnect status transitions.
Spacing: compact.
Typography: small/body.
Color tokens: warning/info.
Icons: connectivity icon.
Props: lastSyncedAt.
Events: onRetry.
Usage examples: Offline memory mode.
Do: show stale timestamp.
Don’t: hide limited functionality.
Related components: Sync Indicator.

### 11.6 Error State

Purpose: full-surface failure fallback.
Business value: recoverability from blocked views.
Visual description: clear error summary and action set.
When to use: page or component cannot render data.
When not to use: minor inline field errors.
Variants: page, panel.
Sizes: md, lg.
States: visible, retrying.
Responsive behavior: responsive layout with CTA first.
Keyboard behavior: retry and secondary actions focusable.
ARIA guidance: alert region with details.
Animations: none heavy.
Spacing: medium/large.
Typography: heading/body.
Color tokens: semantic error.
Icons: error symbol.
Props: title, details.
Events: onRetry, onContactSupport.
Usage examples: Failed to load replay.
Do: include correlation/context id when available.
Don’t: blame user without cause.
Related components: Retry State.

### 11.7 Retry State

Purpose: recover from transient failure.
Business value: improves completion rates without full refresh.
Visual description: inline retry control with error context.
When to use: recoverable API failures.
When not to use: irreversible business rule failures.
Variants: inline, panel.
Sizes: sm, md.
States: failed, retrying, recovered.
Responsive behavior: full-width retry button mobile.
Keyboard behavior: retry button accessible.
ARIA guidance: status updates announced.
Animations: retry spinner.
Spacing: compact.
Typography: small/body.
Color tokens: semantic error/info.
Icons: retry icon.
Props: retryCount.
Events: onRetry.
Usage examples: Retry sync.
Do: show attempt outcomes.
Don’t: infinite auto-retry loops.
Related components: Error State.

---

## 12. Modals and Panels

### 12.1 Dialog

Purpose: focused interruption for contextual task.
Business value: avoids route change overhead.
Visual description: centered modal with header/body/footer.
When to use: short decision/task blocks.
When not to use: large multi-step workflows.
Variants: compact, standard.
Sizes: sm, md, lg.
States: open, closing.
Responsive behavior: full-screen modal on small mobile.
Keyboard behavior: focus trap, Esc close where safe.
ARIA guidance: role dialog, ariaModal true.
Animations: fade/scale subtle.
Spacing: modal spacing tokens.
Typography: heading/body.
Color tokens: surface raised + overlay.
Icons: optional.
Props: open, title.
Events: onClose.
Usage examples: Rename workspace.
Do: keep single clear primary action.
Don’t: overload with complex forms.
Related components: Drawer.

### 12.2 Confirmation Modal

Purpose: explicit confirmation for high-impact actions.
Business value: error prevention.
Visual description: concise risk summary + confirm/cancel.
When to use: destructive or irreversible actions.
When not to use: low-risk actions.
Variants: destructive, critical approval.
Sizes: sm, md.
States: open, confirming.
Responsive behavior: standard modal behavior.
Keyboard behavior: focus defaults to safe action.
ARIA guidance: announce consequence.
Animations: minimal.
Spacing: compact.
Typography: heading/body.
Color tokens: semantic warning/error.
Icons: warning icon.
Props: consequenceText.
Events: onConfirm, onCancel.
Usage examples: Delete automation rule.
Do: state consequence clearly.
Don’t: use generic “Are you sure?”.
Related components: Danger Button.

### 12.3 Wizard Modal

Purpose: step-by-step guided setup.
Business value: reduces complexity for multi-step tasks.
Visual description: stepper header + step body + nav controls.
When to use: onboarding, configuration flows.
When not to use: simple one-step forms.
Variants: linear, non-linear with validation gates.
Sizes: lg, xl.
States: step active, completed, blocked.
Responsive behavior: step list collapses mobile.
Keyboard behavior: next/back accessible.
ARIA guidance: step progress announced.
Animations: step transition slide/fade.
Spacing: generous.
Typography: heading/body.
Color tokens: brand + neutral.
Icons: step status icons.
Props: steps, currentStep.
Events: onNext, onBack, onComplete.
Usage examples: New workflow setup.
Do: save draft state.
Don’t: hide step requirements.
Related components: Form components.

### 12.4 Fullscreen Modal

Purpose: immersive focused workflow.
Business value: supports complex editing without navigation churn.
Visual description: full viewport overlay workspace.
When to use: advanced editors and replay deep dives.
When not to use: simple confirmations.
Variants: editor, analyzer.
Sizes: full.
States: open.
Responsive behavior: native full-screen behavior on all devices.
Keyboard behavior: focus boundaries and exit shortcuts.
ARIA guidance: dialog semantics with title region.
Animations: route-like transition.
Spacing: page-scale spacing.
Typography: full-page hierarchy.
Color tokens: workspace tokens.
Icons: context dependent.
Props: open, title.
Events: onClose.
Usage examples: Replay debugger.
Do: provide persistent exit control.
Don’t: hide save/discard state.
Related components: Resizable Panels.

### 12.5 Drawer

Purpose: side-in contextual workflow panel.
Business value: preserves page context while editing details.
Visual description: anchored side panel overlay.
When to use: object details/edit forms.
When not to use: critical confirmations.
Variants: left, right.
Sizes: sm, md, lg.
States: open, collapsed.
Responsive behavior: full-width slide panel on mobile.
Keyboard behavior: focus trap.
ARIA guidance: dialog semantics if modal.
Animations: slide-in.
Spacing: medium.
Typography: section headers.
Color tokens: raised surface.
Icons: optional.
Props: open, width.
Events: onClose.
Usage examples: Edit customer details.
Do: keep context summary at top.
Don’t: cram multi-step wizards without structure.
Related components: Side Panel.

### 12.6 Side Panel

Purpose: persistent contextual insights/details.
Business value: supports multitasking analysis.
Visual description: docked panel adjacent main content.
When to use: secondary details and references.
When not to use: blocking tasks.
Variants: collapsible, pinned.
Sizes: md, lg.
States: open, collapsed.
Responsive behavior: convert to drawer mobile.
Keyboard behavior: panel toggle keyboard accessible.
ARIA guidance: complementary landmark.
Animations: width/collapse.
Spacing: compact-medium.
Typography: small/body.
Color tokens: surface muted.
Icons: optional section icons.
Props: sections.
Events: onToggle.
Usage examples: Reasoning details while browsing list.
Do: preserve user-set width.
Don’t: steal focus unexpectedly.
Related components: Drawer, Split Layout.

### 12.7 Bottom Sheet

Purpose: touch-friendly modal interaction on mobile.
Business value: preserves context and ergonomics.
Visual description: bottom-anchored sheet with drag handle.
When to use: action lists, selectors on mobile.
When not to use: desktop primary modal pattern.
Variants: partial, full-height.
Sizes: mobile focused.
States: collapsed, expanded.
Responsive behavior: mobile/tablet only.
Keyboard behavior: accessible controls and close.
ARIA guidance: dialog semantics.
Animations: slide up/down.
Spacing: mobile spacing tokens.
Typography: body/nav.
Color tokens: surface raised.
Icons: drag handle optional.
Props: open, snapPoints.
Events: onClose, onSnapChange.
Usage examples: Workspace switcher mobile.
Do: keep primary action reachable.
Don’t: hide close affordance.
Related components: Drawer.

---

## 13. Workspace Components

### 13.1 Widget

Purpose: Modular dashboard building block.
Business value: personalized insight composition.
Visual description: bounded card-like module with title and content.
When to use: dashboard and workspace overviews.
When not to use: long-form pages.
Variants: data, action, summary.
Sizes: grid span based.
States: loading, ready, empty.
Responsive behavior: auto reflow by grid.
Keyboard behavior: widget focus and action control access.
ARIA guidance: region labels.
Animations: reorder transitions.
Spacing: widget internal tokens.
Typography: heading/body.
Color tokens: surface/border/text.
Icons: optional in header.
Props: title, span.
Events: onMove, onResize.
Usage examples: KPI widget.
Do: define clear owner metric.
Don’t: create widget without action path.
Related components: Dashboard Grid.

### 13.2 Dashboard Grid

Purpose: Layout manager for widgets.
Business value: flexible overview composition.
Visual description: responsive draggable grid.
When to use: dashboard pages.
When not to use: simple static pages.
Variants: fixed, user-configurable.
Sizes: responsive columns.
States: edit mode, view mode.
Responsive behavior: single-column mobile.
Keyboard behavior: reorder alternatives accessible.
ARIA guidance: grid region labels.
Animations: drag placeholder transitions.
Spacing: grid gap tokens.
Typography: n/a.
Color tokens: transparent/surface.
Icons: edit controls.
Props: layout, widgets.
Events: onLayoutChange.
Usage examples: Personalized executive dashboard.
Do: persist user layout.
Don’t: break reading order when reflowing.
Related components: Widget.

### 13.3 Activity Feed

Purpose: chronological stream of important activity.
Business value: operational awareness.
Visual description: ordered entries with timestamps and actions.
When to use: dashboard and module activity pages.
When not to use: static reports.
Variants: compact, detailed.
Sizes: md, lg.
States: live, paused, empty.
Responsive behavior: condensed entry layout mobile.
Keyboard behavior: entry navigation.
ARIA guidance: list semantics.
Animations: new item insert subtle.
Spacing: vertical rhythm.
Typography: body/small.
Color tokens: neutral + semantic markers.
Icons: event icons.
Props: items.
Events: onItemOpen.
Usage examples: Recent system actions.
Do: include actor/source.
Don’t: stream low-value noise.
Related components: Realtime Event Notification.

### 13.4 KPI Block

Purpose: compact key metric cluster.
Business value: fast status scan.
Visual description: value grid with labels and deltas.
When to use: summaries.
When not to use: detailed analysis.
Variants: 2-up, 4-up.
Sizes: sm, md.
States: default, loading.
Responsive behavior: stack values mobile.
Keyboard behavior: links focusable if interactive.
ARIA guidance: value-label association.
Animations: delta updates.
Spacing: compact.
Typography: metric tokens.
Color tokens: text + semantic.
Icons: optional trend.
Props: metrics.
Events: onMetricOpen.
Usage examples: Executive quick stats.
Do: keep units explicit.
Don’t: mix incompatible scales.
Related components: Metric Card.

### 13.5 Task List

Purpose: prioritized actionable task queue.
Business value: execution tracking.
Visual description: checklist/list with status and owner.
When to use: operations and approvals.
When not to use: generic notifications.
Variants: simple, grouped.
Sizes: md, lg.
States: pending, inProgress, done, blocked.
Responsive behavior: compact task rows mobile.
Keyboard behavior: checkbox and action keyboard-friendly.
ARIA guidance: list and status semantics.
Animations: completion transitions.
Spacing: list gap.
Typography: body/small.
Color tokens: status semantic.
Icons: status/priority icons.
Props: tasks.
Events: onCompleteTask, onOpenTask.
Usage examples: Daily action queue.
Do: sort by urgency.
Don’t: hide blockers.
Related components: Action Queue.

### 13.6 Calendar

Purpose: date-based schedule view.
Business value: planning and workload visibility.
Visual description: month/week/day grid.
When to use: scheduling workflows.
When not to use: simple due-date lists.
Variants: month, week, day.
Sizes: lg.
States: populated, empty.
Responsive behavior: agenda mode mobile default.
Keyboard behavior: date navigation keys.
ARIA guidance: grid semantics with date labels.
Animations: view transitions.
Spacing: cell spacing.
Typography: small/body.
Color tokens: neutral + event colors.
Icons: optional event type.
Props: events, view.
Events: onDateSelect, onEventOpen.
Usage examples: Automation schedules.
Do: show timezone context.
Don’t: overcrowd with unreadable labels.
Related components: Agenda.

### 13.7 Agenda

Purpose: linear chronological schedule list.
Business value: mobile-friendly planning view.
Visual description: grouped events by date/time.
When to use: compact schedule contexts.
When not to use: spatial calendar planning.
Variants: daily, weekly.
Sizes: md.
States: empty, populated.
Responsive behavior: primary mode on mobile.
Keyboard behavior: list navigation.
ARIA guidance: list with date headings.
Animations: expand day group.
Spacing: date group spacing.
Typography: body/small.
Color tokens: neutral.
Icons: event indicators.
Props: entries.
Events: onEntryOpen.
Usage examples: Today agenda.
Do: keep time clear.
Don’t: hide timezone.
Related components: Calendar.

### 13.8 Quick Actions

Purpose: high-frequency context actions.
Business value: reduced click depth.
Visual description: horizontal or grid action shortcuts.
When to use: dashboards and workspace headers.
When not to use: dense action sets better served by command palette.
Variants: iconOnly, iconText.
Sizes: sm, md.
States: enabled, disabled.
Responsive behavior: wrap or overflow mobile.
Keyboard behavior: full tab order.
ARIA guidance: clear labels mandatory.
Animations: hover emphasis.
Spacing: action gaps.
Typography: type.small/button.
Color tokens: neutral/brand.
Icons: required.
Props: actions.
Events: onActionClick.
Usage examples: Create report.
Do: keep top 3 to 6 actions.
Don’t: include low-frequency actions.
Related components: Floating Action Button.

### 13.9 Pinned Items

Purpose: user-pinned entities and views.
Business value: workflow continuity.
Visual description: compact list/grid of shortcuts.
When to use: dashboards, side panels.
When not to use: transient session-only items.
Variants: list, chip row.
Sizes: sm, md.
States: pinned, unpinned.
Responsive behavior: horizontal scroll row mobile.
Keyboard behavior: quick open and unpin shortcuts.
ARIA guidance: list semantics.
Animations: pin/unpin transitions.
Spacing: compact.
Typography: small.
Color tokens: neutral/brand accents.
Icons: pin icon.
Props: items.
Events: onOpenItem, onUnpin.
Usage examples: Pinned context IDs.
Do: persist across sessions.
Don’t: auto-pin without user intent.
Related components: Recent Activity.

### 13.10 Recent Activity

Purpose: quick return to recently visited/edited items.
Business value: reduces navigation friction.
Visual description: chronological recent list.
When to use: dashboards and side panels.
When not to use: long-term history archive.
Variants: compact list.
Sizes: sm, md.
States: empty, populated.
Responsive behavior: compact cards mobile.
Keyboard behavior: list navigation.
ARIA guidance: list semantics.
Animations: new item insert.
Spacing: tight.
Typography: small/body.
Color tokens: neutral.
Icons: type icons.
Props: recentItems.
Events: onOpenRecent.
Usage examples: Continue prior analysis.
Do: include timestamp.
Don’t: include sensitive hidden items without permission checks.
Related components: Activity Feed, Pinned Items.

---

## 14. Layout Components

### 14.1 Page Header

Purpose: page-level identity and primary actions.
Business value: immediate orientation.
Visual description: title, subtitle, actions, breadcrumbs optional.
When to use: all major pages.
When not to use: tiny embedded panels.
Variants: standard, compact, withTabs.
Sizes: md, lg.
States: default.
Responsive behavior: actions collapse into menu mobile.
Keyboard behavior: action accessibility.
ARIA guidance: heading hierarchy.
Animations: minimal sticky behavior.
Spacing: top and bottom rhythm.
Typography: heading tokens.
Color tokens: surface/text.
Icons: optional title icon.
Props: title, actions.
Events: onPrimaryAction.
Usage examples: Customers page header.
Do: keep title outcome-oriented.
Don’t: overload with secondary controls.
Related components: Section Header.

### 14.2 Section Header

Purpose: delineate content sections.
Business value: scanning efficiency.
Visual description: section title + optional action.
When to use: cards and page subsections.
When not to use: every minor grouping.
Variants: plain, withAction.
Sizes: sm, md.
States: default.
Responsive behavior: action moves below title on narrow widths.
Keyboard behavior: action accessible.
ARIA guidance: semantic heading levels.
Animations: none required.
Spacing: section spacing tokens.
Typography: heading small.
Color tokens: text primary.
Icons: optional.
Props: title, action.
Events: onAction.
Usage examples: Recent activity section.
Do: maintain hierarchy levels.
Don’t: skip heading levels.
Related components: Page Header.

### 14.3 Hero

Purpose: high-impact introductory section.
Business value: communicates strategic narrative quickly.
Visual description: large typography, concise copy, CTA group.
When to use: landing and major workspace intros.
When not to use: transactional pages.
Variants: marketing, product onboarding.
Sizes: lg, xl.
States: default.
Responsive behavior: typography scales down gracefully.
Keyboard behavior: CTA focus.
ARIA guidance: heading semantics.
Animations: subtle reveal.
Spacing: large whitespace blocks.
Typography: hero/display tokens.
Color tokens: brand/subtle backgrounds.
Icons: optional illustration anchors.
Props: title, subtitle, ctas.
Events: onPrimaryCta.
Usage examples: Homepage hero.
Do: keep message clear.
Don’t: clutter with too many CTAs.
Related components: Landing Layout.

### 14.4 Container

Purpose: constrain content width and alignment.
Business value: consistent readability.
Visual description: centered max-width wrapper.
When to use: all pages.
When not to use: full-bleed data canvases needing edge-to-edge.
Variants: narrow, standard, wide.
Sizes: by breakpoint tokens.
States: n/a.
Responsive behavior: margin/padding per breakpoint.
Keyboard behavior: n/a.
ARIA guidance: n/a.
Animations: n/a.
Spacing: horizontal margins from spacing scale.
Typography: n/a.
Color tokens: n/a.
Icons: n/a.
Props: maxWidth.
Events: none.
Usage examples: Main content wrapper.
Do: keep line length readable.
Don’t: exceed max widths for text-heavy sections.
Related components: Grid, Stack.

### 14.5 Grid

Purpose: structured two-dimensional layout.
Business value: alignment and responsive consistency.
Visual description: column-based placement.
When to use: dashboards and multi-panel pages.
When not to use: simple linear content.
Variants: fixed, auto-fit.
Sizes: 4/8/12 columns by breakpoint.
States: n/a.
Responsive behavior: auto reflow.
Keyboard behavior: n/a.
ARIA guidance: layout only.
Animations: optional reorder transitions.
Spacing: grid gap tokens.
Typography: n/a.
Color tokens: n/a.
Icons: n/a.
Props: columns, gap.
Events: none.
Usage examples: Dashboard metrics grid.
Do: align to tokenized gutters.
Don’t: mix arbitrary pixel grids.
Related components: Container, Dashboard Grid.

### 14.6 Stack

Purpose: one-dimensional vertical/horizontal layout primitive.
Business value: predictable spacing rhythm.
Visual description: ordered children with consistent gap.
When to use: forms, card internals, action groups.
When not to use: complex two-dimensional arrangements.
Variants: vertical, horizontal.
Sizes: gap tokens.
States: n/a.
Responsive behavior: direction switch support.
Keyboard behavior: n/a.
ARIA guidance: n/a.
Animations: optional child stagger.
Spacing: explicit gap token.
Typography: n/a.
Color tokens: n/a.
Icons: n/a.
Props: direction, gap, align.
Events: none.
Usage examples: Button row.
Do: use tokenized gaps.
Don’t: manual margins between children.
Related components: Grid.

### 14.7 Split Layout

Purpose: side-by-side contextual work surfaces.
Business value: comparison and multitasking.
Visual description: two-pane layout.
When to use: replay/detail and list/detail flows.
When not to use: simple single-focus pages.
Variants: fixed ratio, resizable.
Sizes: md, lg, xl.
States: collapsed, expanded.
Responsive behavior: stacked panes mobile.
Keyboard behavior: pane focus switching.
ARIA guidance: labeled regions.
Animations: resize transition subtle.
Spacing: gutter token.
Typography: n/a.
Color tokens: surface tokens.
Icons: optional splitter handle icon.
Props: paneSizes.
Events: onResize.
Usage examples: Event list + payload detail.
Do: persist user ratio.
Don’t: force tiny unreadable panes.
Related components: Resizable Panels.

### 14.8 Resizable Panels

Purpose: user-controlled panel sizing.
Business value: adaptable expert workflows.
Visual description: draggable dividers.
When to use: data-dense analysis surfaces.
When not to use: small screens.
Variants: vertical, horizontal split.
Sizes: context dependent.
States: dragging, snapped.
Responsive behavior: disable drag on mobile; provide presets.
Keyboard behavior: keyboard resizing via shortcuts.
ARIA guidance: separator role with values.
Animations: smooth resize.
Spacing: panel gap token.
Typography: n/a.
Color tokens: border/handle tokens.
Icons: drag handle.
Props: minSize, maxSize.
Events: onResizeStart, onResizeEnd.
Usage examples: Replay debugger panels.
Do: enforce minimum readable sizes.
Don’t: allow invisible collapsed panels accidentally.
Related components: Split Layout.

### 14.9 Workspace Layout

Purpose: authenticated OS shell layout.
Business value: continuity across modules.
Visual description: top nav + sidebar + content + optional rail.
When to use: all authenticated workspaces.
When not to use: public marketing pages.
Variants: withRightRail, noRightRail.
Sizes: responsive.
States: default.
Responsive behavior: sidebar becomes drawer mobile.
Keyboard behavior: skip links and landmark navigation.
ARIA guidance: major landmarks required.
Animations: shell transitions minimal.
Spacing: shell spacing tokens.
Typography: n/a.
Color tokens: app surface tokens.
Icons: nav icons.
Props: currentWorkspace.
Events: onNavigate.
Usage examples: Main app layout.
Do: keep shell consistent.
Don’t: rebuild layout per page.
Related components: Top Navigation, Sidebar.

### 14.10 Landing Layout

Purpose: public narrative presentation layout.
Business value: communicates product story and trust.
Visual description: sectioned storytelling layout with generous whitespace.
When to use: homepage and marketing pages.
When not to use: in-app operational pages.
Variants: story-first, conversion-focused.
Sizes: responsive max width containers.
States: default.
Responsive behavior: section stacking and type scaling.
Keyboard behavior: semantic landmarks and skip links.
ARIA guidance: heading and nav landmarks.
Animations: scroll narrative motion restrained.
Spacing: large section gaps.
Typography: hero/display/body.
Color tokens: brand + subtle backgrounds.
Icons: limited decorative support.
Props: sections.
Events: onCtaClick.
Usage examples: AIOS website pages.
Do: prioritize clarity over effects.
Don’t: copy competitor section structures.
Related components: Hero, Container.

---

## 15. Authentication Components

### 15.1 Login Component

Purpose: user sign-in.
Business value: secure platform access.
Visual description: credential form + contextual trust hints.
When to use: auth entry.
When not to use: generic forms.
Variants: password, SSO-first.
Sizes: md, lg card.
States: idle, validating, error, locked.
Responsive behavior: single-column mobile.
Keyboard behavior: enter submit and focus order strict.
ARIA guidance: form labels and errors announced.
Animations: subtle transitions.
Spacing: focused form spacing.
Typography: heading/body/form tokens.
Color tokens: auth surface tokens.
Icons: optional provider icons.
Props: ssoProviders, rememberMe.
Events: onSubmit, onSsoSelect.
Usage examples: Sign-in page.
Do: show helpful error states.
Don’t: expose security-sensitive details.
Related components: Forgot Password, 2FA.

### 15.2 Register Component

Purpose: account creation.
Business value: onboarding conversion.
Visual description: staged registration form.
When to use: self-service onboarding.
When not to use: invite-only flows without registration.
Variants: standard, invited.
Sizes: lg.
States: idle, validating, success, error.
Responsive behavior: vertical flow mobile.
Keyboard behavior: logical progression.
ARIA guidance: field-level validation messaging.
Animations: step transitions mild.
Spacing: form spacing tokens.
Typography: form tokens.
Color tokens: surface/text/border.
Icons: optional.
Props: planContext, inviteToken.
Events: onSubmit.
Usage examples: New org signup.
Do: use progressive disclosure.
Don’t: ask unnecessary upfront details.
Related components: Organization Switcher.

### 15.3 Forgot Password Component

Purpose: initiate credential recovery.
Business value: account recovery without support friction.
Visual description: simple email input and confirmation state.
When to use: password reset entry.
When not to use: logged-in settings password change.
Variants: request, confirmation.
Sizes: md.
States: idle, sent, error.
Responsive behavior: standard.
Keyboard behavior: submit via Enter.
ARIA guidance: confirmation status announced.
Animations: minimal.
Spacing: compact.
Typography: form/body.
Color tokens: neutral + info.
Icons: optional mail icon.
Props: email.
Events: onSubmit.
Usage examples: Forgot password flow.
Do: keep instructions clear.
Don’t: reveal if account exists.
Related components: Login.

### 15.4 2FA Component

Purpose: second-factor verification.
Business value: enhanced security.
Visual description: code input with timer/resend.
When to use: MFA required logins and sensitive operations.
When not to use: low-security public actions.
Variants: OTP, authenticator app.
Sizes: md.
States: waiting, verifying, success, expired, error.
Responsive behavior: numeric keyboard mobile.
Keyboard behavior: auto-advance fields optional.
ARIA guidance: code input labeling.
Animations: timer subtle.
Spacing: medium.
Typography: code-friendly input.
Color tokens: neutral + semantic.
Icons: security icon optional.
Props: method, expiresAt.
Events: onVerify, onResend.
Usage examples: MFA challenge.
Do: show fallback options.
Don’t: lockout without clear recovery.
Related components: Login, Permissions Notice.

### 15.5 Organisation Switcher

Purpose: switch org tenant context.
Business value: multi-tenant productivity.
Visual description: org list selector with role preview.
When to use: multi-org users.
When not to use: single-org users.
Variants: dropdown, full-page selector.
Sizes: md.
States: default, loading.
Responsive behavior: bottom sheet mobile.
Keyboard behavior: list navigation.
ARIA guidance: listbox semantics.
Animations: list reveal.
Spacing: medium.
Typography: nav/body.
Color tokens: surface/text.
Icons: org avatars.
Props: organisations, currentOrg.
Events: onOrgChange.
Usage examples: Switch client org.
Do: show role and environment.
Don’t: hide active org indicator.
Related components: Workspace Switcher.

### 15.6 User Profile Component

Purpose: profile and personal settings.
Business value: user control and identity clarity.
Visual description: profile summary + editable fields.
When to use: account settings surfaces.
When not to use: auth entry pages.
Variants: compact summary, full settings.
Sizes: md, lg.
States: view, edit, saving, error.
Responsive behavior: section stack mobile.
Keyboard behavior: form navigation.
ARIA guidance: field labels and section headings.
Animations: edit-state transitions.
Spacing: form spacing.
Typography: body/form.
Color tokens: surface/text/border.
Icons: avatar controls.
Props: user.
Events: onUpdateProfile.
Usage examples: Update preferences.
Do: autosave indicators clear.
Don’t: hide permission-bound fields.
Related components: Permissions.

### 15.7 Permissions Component

Purpose: role and permission visibility/control UI.
Business value: governance and security.
Visual description: role matrix or list with scoped permissions.
When to use: admin and org settings.
When not to use: non-admin personal settings.
Variants: matrix, role-details.
Sizes: lg, xl.
States: loading, editable, readOnly.
Responsive behavior: simplified role list mobile.
Keyboard behavior: table/form navigation.
ARIA guidance: grid/table semantics where matrix used.
Animations: minimal changes.
Spacing: medium.
Typography: table/form tokens.
Color tokens: neutral + semantic alerts.
Icons: lock/shield.
Props: roles, permissions.
Events: onPermissionChange, onRoleAssign.
Usage examples: Access policy management.
Do: show impact before saving changes.
Don’t: permit silent privilege escalation.
Related components: Administrator pages.

---

## 16. Corporate Components

### 16.1 Organisation Card

Purpose: org-level snapshot.
Business value: portfolio and tenant visibility.
Visual description: org identity, status, key metrics.
When to use: org lists and switchers.
When not to use: detailed org settings pages.
Variants: compact, detailed.
Sizes: md, lg.
States: active, suspended.
Responsive behavior: stacked metrics mobile.
Keyboard behavior: open/select actions.
ARIA guidance: card role with label.
Animations: hover emphasis.
Spacing: medium.
Typography: heading/body.
Color tokens: neutral + status.
Icons: org icon/avatar.
Props: organisation.
Events: onOpenOrganisation.
Usage examples: Multi-org dashboard.
Do: surface org health status.
Don’t: omit environment info where relevant.
Related components: Department Card.

### 16.2 Department Card

Purpose: department-level overview.
Business value: organizational operating clarity.
Visual description: department name, owner, performance markers.
When to use: corporate structure views.
When not to use: employee-level details.
Variants: summary, performance.
Sizes: md.
States: normal, atRisk.
Responsive behavior: compact text mobile.
Keyboard behavior: open details.
ARIA guidance: clear title and metadata.
Animations: subtle status updates.
Spacing: medium.
Typography: body/small.
Color tokens: neutral + semantic.
Icons: department icon.
Props: department.
Events: onOpenDepartment.
Usage examples: Department directory.
Do: include owner context.
Don’t: hide critical risk tag.
Related components: Organisation Card, Employee Card.

### 16.3 Employee Card

Purpose: employee profile summary in org context.
Business value: ownership and accountability visibility.
Visual description: name, role, status, assigned workload summary.
When to use: people and ownership views.
When not to use: sensitive HR-only data contexts without permissions.
Variants: compact, workload.
Sizes: sm, md.
States: active, unavailable.
Responsive behavior: avatar and key info prioritized mobile.
Keyboard behavior: open profile action.
ARIA guidance: descriptive labels.
Animations: none heavy.
Spacing: compact.
Typography: body/small.
Color tokens: neutral.
Icons: role badge optional.
Props: employee.
Events: onOpenEmployee.
Usage examples: Task owner references.
Do: respect permission-scoped fields.
Don’t: expose private info by default.
Related components: Department Card.

### 16.4 Client Card

Purpose: client relationship summary.
Business value: account management clarity.
Visual description: client identity, relationship status, key indicators.
When to use: client list and account overviews.
When not to use: transaction-only records.
Variants: compact, health-focused.
Sizes: md.
States: healthy, warning, critical.
Responsive behavior: compact mobile card.
Keyboard behavior: open account.
ARIA guidance: client label and status announced.
Animations: status shift.
Spacing: medium.
Typography: body/small.
Color tokens: semantic + neutral.
Icons: status icon.
Props: client.
Events: onOpenClient.
Usage examples: Client monitoring.
Do: display latest meaningful signal.
Don’t: show stale status without timestamp.
Related components: Customer Card.

### 16.5 Project Card

Purpose: project progress and health snapshot.
Business value: execution tracking.
Visual description: project title, phase, owner, progress.
When to use: project dashboards.
When not to use: deep project management detail pages.
Variants: progress, risk.
Sizes: md, lg.
States: onTrack, atRisk, blocked, completed.
Responsive behavior: compact phase/progress mobile.
Keyboard behavior: open project.
ARIA guidance: progress semantics.
Animations: progress updates.
Spacing: medium.
Typography: body/small.
Color tokens: semantic project status.
Icons: phase icon optional.
Props: project.
Events: onOpenProject.
Usage examples: Program oversight.
Do: include due date context.
Don’t: hide blockers.
Related components: Task List.

### 16.6 Invoice Card

Purpose: invoice status summary.
Business value: financial operations visibility.
Visual description: amount, due date, status, client link.
When to use: billing views.
When not to use: aggregate-only financial reporting.
Variants: dueSoon, overdue, paid.
Sizes: sm, md.
States: pending, paid, overdue, disputed.
Responsive behavior: amount and status priority mobile.
Keyboard behavior: open invoice action.
ARIA guidance: amount/date/status announced.
Animations: status transitions.
Spacing: compact.
Typography: body/small/metric.
Color tokens: semantic finance statuses.
Icons: invoice/status icon.
Props: invoice.
Events: onOpenInvoice.
Usage examples: Accounts receivable queue.
Do: emphasize due date.
Don’t: present monetary values without currency.
Related components: Revenue Card.

### 16.7 Revenue Card

Purpose: revenue snapshot and change marker.
Business value: financial trend awareness.
Visual description: primary revenue metric + delta.
When to use: executive finance sections.
When not to use: detailed financial statements.
Variants: period, forecast.
Sizes: md, lg.
States: positive, neutral, declining.
Responsive behavior: compact metric layout mobile.
Keyboard behavior: open detail action.
ARIA guidance: period and unit announced.
Animations: delta transitions.
Spacing: medium.
Typography: metric emphasis.
Color tokens: neutral + semantic trend.
Icons: trend arrows.
Props: amount, delta, period.
Events: onOpenRevenueReport.
Usage examples: Monthly recurring revenue.
Do: include timeframe.
Don’t: show isolated number without context.
Related components: Metric Card.

### 16.8 Sales Pipeline Card

Purpose: pipeline stage and conversion snapshot.
Business value: revenue risk and opportunity visibility.
Visual description: stage distribution and velocity indicators.
When to use: sales workspace overviews.
When not to use: detailed opportunity management tables.
Variants: stageSummary, riskSummary.
Sizes: md, lg.
States: healthy, atRisk.
Responsive behavior: simplified stage bars mobile.
Keyboard behavior: open pipeline action.
ARIA guidance: stage labels and values.
Animations: stage delta updates.
Spacing: medium.
Typography: body/small/metric.
Color tokens: brand + warning/error where needed.
Icons: pipeline/stage indicators.
Props: stages, totals.
Events: onOpenPipeline.
Usage examples: Weekly sales review.
Do: surface stalled stage risk.
Don’t: hide conversion denominator.
Related components: Bar Chart, Revenue Card.

---

## 17. Governance and Enforcement

### 17.1 Enforcement Rule

All frontend implementations must use only components defined in this document.

### 17.2 Extension Process

A new component may be added only when:

- Existing components cannot satisfy the use case without violating UX or accessibility standards.
- A formal proposal includes purpose, business value, token mapping, interaction model, and accessibility behavior.
- Design Systems governance approves the addition.

### 17.3 Release Gates for Component Adoption

No component can be considered production-ready without:

- Spec completeness against this contract
- Accessibility pass
- Responsive behavior validation
- Motion behavior validation
- Token compliance validation

---

## 18. Final Non-Negotiables

- No ad-hoc component invention at page level
- No token bypass styling
- No inaccessible interaction behavior
- No flashy motion beyond purpose-driven transitions
- No ambiguous AI components without explainability support

AIOS Component Library V2 is now the official reusable component contract for the entire AIOS platform.
