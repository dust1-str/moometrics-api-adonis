CREATE SEQUENCE public.pky_sequence
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    CACHE 1;

CREATE SEQUENCE public.apiid_sequence
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    CACHE 1;

CREATE SEQUENCE public.evid_sequence
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    CACHE 1;

CREATE TABLE events (
    evid integer DEFAULT nextval('public.evid_sequence'::regclass),
    pky bigint,
    technician integer,
    eventtype character varying, -- Tipos dnb abortions births breedings culls diagnosis dryoffs freshs hoofs moves pregchecks
    evdate date,  -- date actual
    evfdat date,  -- date actual
    evage smallint,
    evdim smallint,
    evlact smallint,
    evlagr smallint,
    evpen smallint,
    age1blt smallint,
    agemo smallint,
    bdate date,
    brd character varying(25),
    sex character(1),
    age smallint,
    assoprot character varying(25),
    dim smallint,
    evageday smallint,
    evagemo smallint,
    evgap smallint,
    evgaprange character varying(25),
    evloc character varying(25),
    evnote character varying(25),
    evnum smallint,
    evnumt smallint,
    evsirebreed character(2),
    evsirenaab character(10),
    evweek date,
    evsirestudcd integer,
    msdevbarn character(10),
    tech character varying(50),
    levdesc character varying(50)
);

CREATE TABLE public.inventory (
    apiid integer NOT NULL DEFAULT nextval('public.apiid_sequence'::regclass), 
    stable_id integer NOT NULL, 
    barnnm character varying(25),
    bdate date,  -- date actual
    bdateweek date, -- date actual
    brd character varying(25),
    dhfr smallint,
    bfcf smallint,
    sex character(1), -- random F y M
    sicrbr character varying(25),
    sirebreed character(2), 
    sirc character varying(20),
    purcdate date,
    bv_me305 character varying(20),
    chbrdnote character varying(25),
    seruresult character varying,
    sirsbr character(2),
    pky bigint DEFAULT nextval('public.pky_sequence'::regclass)
);

ALTER TABLE public.inventory
    ALTER COLUMN pky SET DEFAULT nextval('public.pky_sequence');
ALTER TABLE public.inventory
    ALTER COLUMN apiid SET DEFAULT nextval('public.apiid_sequence');
ALTER TABLE public.events
    ALTER COLUMN evid SET DEFAULT nextval('public.evid_sequence');
ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_pkey PRIMARY KEY (apiid);
ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_pky_key UNIQUE (pky);
ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (evid);
ALTER TABLE ONLY public.events
    ADD CONSTRAINT fk_events_inventory FOREIGN KEY (pky) REFERENCES public.inventory(pky) NOT VALID;
