-- Script de rollback para DPN-EXAMPLE.sql
-- Ejecutar este script para deshacer los cambios

-- Primero eliminar las foreign keys (constraints)
ALTER TABLE ONLY public.abortions DROP CONSTRAINT IF EXISTS fk_abortions_inventory;
ALTER TABLE ONLY public.births DROP CONSTRAINT IF EXISTS fk_births_inventory;
ALTER TABLE ONLY public.breedings DROP CONSTRAINT IF EXISTS fk_breedings_inventory;
ALTER TABLE ONLY public.culls DROP CONSTRAINT IF EXISTS fk_culls_inventory;
ALTER TABLE ONLY public.diagnosis DROP CONSTRAINT IF EXISTS fk_diagnosis_inventory;
ALTER TABLE ONLY public.dryoffs DROP CONSTRAINT IF EXISTS fk_dryoffs_inventory;
ALTER TABLE ONLY public.freshs DROP CONSTRAINT IF EXISTS fk_freshs_inventory;
ALTER TABLE ONLY public.hoofs DROP CONSTRAINT IF EXISTS fk_hoofs_inventory;
ALTER TABLE ONLY public.moves DROP CONSTRAINT IF EXISTS fk_moves_inventory;
ALTER TABLE ONLY public.pregchecks DROP CONSTRAINT IF EXISTS fk_pregchecks_inventory;

-- Eliminar constraints de la tabla inventory
ALTER TABLE ONLY public.inventory DROP CONSTRAINT IF EXISTS inventory_pkey;
ALTER TABLE ONLY public.inventory DROP CONSTRAINT IF EXISTS inventory_pky_key;

-- Eliminar todas las tablas creadas por el script original
DROP TABLE IF EXISTS public.pregchecks;
DROP TABLE IF EXISTS public.moves;
DROP TABLE IF EXISTS public.hoofs;
DROP TABLE IF EXISTS public.freshs;
DROP TABLE IF EXISTS public.dryoffs;
DROP TABLE IF EXISTS public.diagnosis;
DROP TABLE IF EXISTS public.culls;
DROP TABLE IF EXISTS public.breedings;
DROP TABLE IF EXISTS public.births;
DROP TABLE IF EXISTS public.abortions;
DROP TABLE IF EXISTS public.inventory;
DROP TABLE IF EXISTS public.dnb;

-- Eliminar la secuencia
DROP SEQUENCE IF EXISTS public.pky_sequence;

-- Mensaje de confirmación
SELECT 'Rollback completado - Todas las tablas y constraints han sido eliminadas' AS status;