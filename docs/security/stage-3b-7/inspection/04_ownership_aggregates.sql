/*
 * INSPECTION ONLY — NOT YET APPROVED FOR EXECUTION.
 * NEVER RUN AGAINST ANY DATABASE DURING STAGE 3B.7.
 * Before any future execution, review the target environment, role privileges,
 * query plan, catalog visibility, and expected load with the database owner.
 * This file contains SELECT statements only: no DDL, DML, session changes,
 * temporary objects, or application-function calls.
 *
 * These are OPTIONAL query templates. First confirm the exact tables and
 * columns using 01_catalog_inventory.sql. Run individually only after a
 * database owner approves the relation, expected scan cost, and read-only
 * role. Do not execute a template if any referenced column is absent.
 */

/*
 * Customers: prerequisites are public.customers(id, organization_id) and
 * public.organizations(id). Returns counts only; it does not identify or assign
 * any records. A matching organization ID proves only a structural reference,
 * not that the assignment is historically correct.
 *
 * SELECT
 *     count(*) AS total_customers,
 *     count(*) FILTER (WHERE customer.organization_id IS NULL)
 *         AS customers_without_organization,
 *     count(*) FILTER (
 *         WHERE customer.organization_id IS NOT NULL
 *           AND organization.id IS NOT NULL
 *     ) AS customers_with_existing_organization_reference,
 *     count(*) FILTER (
 *         WHERE customer.organization_id IS NOT NULL
 *           AND organization.id IS NULL
 *     ) AS customers_with_missing_organization_reference
 * FROM public.customers AS customer
 * LEFT JOIN public.organizations AS organization
 *     ON organization.id = customer.organization_id;
 */

/*
 * Deals: prerequisites are public.deals(customer_id, organization_id) and
 * public.customers(id, organization_id). If either organization_id does not
 * exist, do not run. Reports null parent/organization and mismatched ownership
 * counts only.
 *
 * SELECT
 *     count(*) AS total_deals,
 *     count(*) FILTER (WHERE deal.customer_id IS NULL)
 *         AS deals_without_customer,
 *     count(*) FILTER (WHERE deal.organization_id IS NULL)
 *         AS deals_without_organization,
 *     count(*) FILTER (
 *         WHERE deal.customer_id IS NOT NULL
 *           AND customer.id IS NULL
 *     ) AS deals_with_missing_customer_reference,
 *     count(*) FILTER (
 *         WHERE customer.id IS NOT NULL
 *           AND deal.organization_id IS DISTINCT FROM customer.organization_id
 *     ) AS deals_with_parent_organization_mismatch
 * FROM public.deals AS deal
 * LEFT JOIN public.customers AS customer
 *     ON customer.id = deal.customer_id;
 */

/*
 * Meetings: prerequisites are public.meetings(customer_id, organization_id)
 * and public.customers(id, organization_id). Same safety rules as the deals
 * diagnostic; returns counts only.
 *
 * SELECT
 *     count(*) AS total_meetings,
 *     count(*) FILTER (WHERE meeting.customer_id IS NULL)
 *         AS meetings_without_customer,
 *     count(*) FILTER (WHERE meeting.organization_id IS NULL)
 *         AS meetings_without_organization,
 *     count(*) FILTER (
 *         WHERE meeting.customer_id IS NOT NULL
 *           AND customer.id IS NULL
 *     ) AS meetings_with_missing_customer_reference,
 *     count(*) FILTER (
 *         WHERE customer.id IS NOT NULL
 *           AND meeting.organization_id IS DISTINCT FROM customer.organization_id
 *     ) AS meetings_with_parent_organization_mismatch
 * FROM public.meetings AS meeting
 * LEFT JOIN public.customers AS customer
 *     ON customer.id = meeting.customer_id;
 */

/*
 * Business events: prerequisite is an owner-reviewed public.events table with
 * an organization_id column. This count cannot prove the source or correctness
 * of assignments. Do not substitute user_id, email, or event IDs.
 *
 * SELECT
 *     count(*) AS total_events,
 *     count(*) FILTER (WHERE event.organization_id IS NULL)
 *         AS events_without_organization
 * FROM public.events AS event;
 */

/*
 * Operational runtime telemetry: inspect separately. Only if the actual
 * aios_events schema has organization_id and the database owner classifies it
 * as organization-visible telemetry may this count be used. Otherwise its
 * tenant ownership is UNKNOWN and this template must not be run.
 *
 * SELECT
 *     count(*) AS total_runtime_events,
 *     count(*) FILTER (WHERE event.organization_id IS NULL)
 *         AS runtime_events_without_organization
 * FROM public.aios_events AS event;
 */
