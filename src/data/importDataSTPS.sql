CREATE DEFINER=`lrangeld`@`%` PROCEDURE `stp_addSolicitudes`(var_folio VARCHAR(16), var_request_item VARCHAR(16), var_opened_at DATETIME, var_work_end DATETIME, var_closed_at DATETIME, var_sys_created_by VARCHAR(50), var_assignment_group VARCHAR(150), var_assigned_to VARCHAR(250), var_state VARCHAR(50), var_short_description MEDIUMTEXT, var_cat_item MEDIUMTEXT, var_description MEDIUMTEXT, var_opened_by VARCHAR(250), var_comments_and_work_notes LONGTEXT, var_sys_updated_by VARCHAR(150), var_sys_updated_on DATETIME, var_location VARCHAR(250), var_u_zone VARCHAR(50), var_order_update DATETIME)
BEGIN
-- Importar solicitudes de ServiceNow a la tabla servicenow_bridge
DECLARE folioActualizado INT;

INSERT INTO `servicenow_bridge` (`folio`, `abierto`, `resuelto`, `cerrado`, `creado_por`, `grup_asig`, `asig_a`, `estatus`, `categoria`, `subcategoria`, `ubicacion`, `abierto_por`, `descripcion`, `sla`,`zona_num`, `obs_notasresolucion`, `resuelto_por`, `incidencia_principal`, `incidencia_secundarias`, `actualizado`, `origen`) VALUES (var_folio, var_opened_at, var_work_end, var_closed_at, var_sys_created_by, var_assignment_group, var_assigned_to, var_state, var_short_description, var_cat_item, var_location, var_opened_by, var_description, 1500, 0, var_comments_and_work_notes, var_sys_updated_by, var_request_item, var_u_zone, var_sys_updated_on, 'SNGlobal Solicitudes');


SELECT COUNT(*) as 'total', max(`abierto`) as 'actualizado', 'solicitudes' as 'type' FROM `servicenow_bridge` WHERE `f_alta` >= var_order_update and LEFT(`folio`, 3) = 'SCT';

END


CREATE DEFINER=`lrangeld`@`%` PROCEDURE `stp_addUnlocks`(var_number VARCHAR(25), var_call_type VARCHAR(25), var_u_advisory_category VARCHAR(15), var_caller VARCHAR(125), var_company VARCHAR(16), var_contact_type VARCHAR(8), var_description TINYTEXT, var_opened_at DATETIME, var_sys_created_on DATETIME, var_sys_updated_on DATETIME, var_time_spent VARCHAR(3), var_opened_by VARCHAR(125), var_sys_created_by VARCHAR(25), var_sys_updated_by VARCHAR(25), var_short_description VARCHAR(5), var_order_update DATETIME)
BEGIN
-- Importar Desbloqueos (interaction) de ServiceNow a la tabla servicenow_bridgeunlock
	INSERT INTO `servicenow_bridgeunlock` (`call_id`, `tipo_llamada`, `categoria`, `solicitante`, `empresa`, `tipo_contacto`, `descripcion`, `abierto`, `creado`, `actualizado`, `tiempo_invertido`, `abierto_por`, `creado_por`, `actualizado_por`, `descripcion_dos`, `f_alta`) VALUES (var_number, var_call_type, var_u_advisory_category, var_caller, var_company, var_contact_type, var_description, var_opened_at, var_sys_created_on, var_sys_updated_on, var_time_spent, var_opened_by, var_sys_created_by, var_sys_updated_by, var_short_description, NOW());


SELECT COUNT(*) as 'total', max(`abierto`) as 'actualizado', 'unlocks' as 'type' FROM `servicenow_bridgeunlock` WHERE `f_alta` >= var_order_update and LEFT(`call_id`, 3) = 'IMS';

END


CREATE DEFINER=`lrangeld`@`%` PROCEDURE `stp_addExcepciones`(var_folio varchar(250), var_zona varchar(45), var_estatus varchar(45), var_inhibidor varchar(45), var_inh_code varchar(245), var_code_desc varchar(45), var_decrip_res varchar(245), var_coment_res longtext, var_procede varchar(45), var_semana varchar(45), var_reporte varchar(45))
BEGIN
-- importe de Excepciones a la tabla eut_weeklyreportinc_bridge o eut_weeklyreportsol_bridge dependiendo del tipo de reporte
IF var_reporte LIKE '%INC%' THEN
	INSERT INTO `eut_weeklyreportinc_bridge`
	(`folio`,`zona`,`estatus`,`inhibidor`,`inh_code`,`code_desc`,`decrip_res`,`coment_res`,`procede`,`ccg`,`semana`,`reporte`)
	VALUES
	(var_folio, var_zona, var_estatus, var_inhibidor, var_inh_code, var_code_desc, var_decrip_res, var_coment_res, var_procede, fn_ajust_ccg(var_code_desc, var_procede), var_semana, fn_ajustReport(var_code_desc, var_procede,var_reporte));

	SELECT COUNT(*) as 'total', now() as 'actualizado', 'incexc' as 'type' FROM `eut_weeklyreportinc_bridge` WHERE LEFT(`folio`, 3) = 'INC';
ELSEIF var_reporte LIKE '%SOL%' THEN
	INSERT INTO `eut_weeklyreportsol_bridge`
	(`folio`, `inhibidor`, `inh_code`, `code_desc`, `coment_res`, `procede`, `ccg`, `semana`, `reporte`)
	VALUES
	(var_folio, var_inhibidor, var_inh_code, var_code_desc, var_coment_res, var_procede, fn_ajust_ccg(var_code_desc, var_procede), var_semana, var_reporte);

	SELECT COUNT(*) as 'total', now() as 'actualizado', 'solexc' as 'type' FROM `eut_weeklyreportsol_bridge` WHERE LEFT(`folio`, 3) = 'SCT';
END IF;

END

CREATE TABLE `servicenow_bridgeunlock` (
    `call_id` varchar(11) NOT NULL,
    `tipo_llamada` varchar(45) DEFAULT NULL,
    `categoria` varchar(100) DEFAULT NULL,
    `solicitante` varchar(150) DEFAULT NULL,
    `empresa` varchar(45) DEFAULT NULL,
    `tipo_contacto` varchar(45) DEFAULT NULL,
    `descripcion` mediumtext,
    `abierto` datetime DEFAULT NULL,
    `creado` datetime DEFAULT NULL,
    `actualizado` datetime DEFAULT NULL,
    `tiempo_invertido` varchar(45) DEFAULT NULL,
    `abierto_por` varchar(150) DEFAULT NULL,
    `creado_por` varchar(45) DEFAULT NULL,
    `actualizado_por` varchar(45) DEFAULT NULL,
    `descripcion_dos` varchar(150) DEFAULT NULL,
    `solicita_elemento` varchar(45) DEFAULT NULL,
    `origen` varchar(65) DEFAULT NULL,
    `user_alta` varchar(45) DEFAULT NULL,
    `f_alta` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb3;

CREATE TABLE `eut_weeklyreportinc_bridge` (
    `folio` varchar(250) DEFAULT NULL,
    `zona` varchar(45) DEFAULT NULL,
    `estatus` varchar(45) DEFAULT NULL,
    `inhibidor` varchar(45) DEFAULT NULL,
    `inh_code` varchar(245) DEFAULT NULL,
    `code_desc` varchar(45) DEFAULT NULL,
    `decrip_res` varchar(245) DEFAULT NULL,
    `coment_res` longtext,
    `procede` varchar(45) DEFAULT NULL,
    `ccg` varchar(45) DEFAULT NULL,
    `semana` varchar(45) DEFAULT NULL,
    `reporte` varchar(45) DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb3;

CREATE TABLE `eut_weeklyreportsol_bridge` (
    `folio` varchar(250) DEFAULT NULL,
    `inhibidor` varchar(45) DEFAULT NULL,
    `inh_code` varchar(245) DEFAULT NULL,
    `code_desc` varchar(45) DEFAULT NULL,
    `coment_res` longtext,
    `procede` varchar(45) DEFAULT NULL,
    `ccg` varchar(45) DEFAULT NULL,
    `semana` varchar(45) DEFAULT NULL,
    `reporte` varchar(45) DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb3;


CREATE DEFINER=`lrangeld`@`%` PROCEDURE `stp_addCcpulseBridge`(`var_objetivo` VARCHAR(250), `var_statisc` VARCHAR(45),  `var_fecha` DATETIME, `var_00:00:00`	VARCHAR(8), `var_00:15:00`	VARCHAR(8), `var_00:30:00`	VARCHAR(8), `var_00:45:00`	VARCHAR(8), `var_01:00:00`	VARCHAR(8), `var_01:15:00`	VARCHAR(8), `var_01:30:00`	VARCHAR(8), `var_01:45:00`	VARCHAR(8), `var_02:00:00`	VARCHAR(8), `var_02:15:00`	VARCHAR(8), `var_02:30:00`	VARCHAR(8), `var_02:45:00`	VARCHAR(8), `var_03:00:00`	VARCHAR(8), `var_03:15:00`	VARCHAR(8), `var_03:30:00`	VARCHAR(8), `var_03:45:00`	VARCHAR(8), `var_04:00:00`	VARCHAR(8), `var_04:15:00`	VARCHAR(8), `var_04:30:00`	VARCHAR(8), `var_04:45:00`	VARCHAR(8), `var_05:00:00`	VARCHAR(8), `var_05:15:00`	VARCHAR(8), `var_05:30:00`	VARCHAR(8), `var_05:45:00`	VARCHAR(8), `var_06:00:00`	VARCHAR(8), `var_06:15:00`	VARCHAR(8), `var_06:30:00`	VARCHAR(8), `var_06:45:00`	VARCHAR(8), `var_07:00:00`	VARCHAR(8), `var_07:15:00`	VARCHAR(8), `var_07:30:00`	VARCHAR(8), `var_07:45:00`	VARCHAR(8), `var_08:00:00`	VARCHAR(8), `var_08:15:00`	VARCHAR(8), `var_08:30:00`	VARCHAR(8), `var_08:45:00`	VARCHAR(8), `var_09:00:00`	VARCHAR(8), `var_09:15:00`	VARCHAR(8), `var_09:30:00`	VARCHAR(8), `var_09:45:00`	VARCHAR(8), `var_10:00:00`	VARCHAR(8), `var_10:15:00`	VARCHAR(8), `var_10:30:00`	VARCHAR(8), `var_10:45:00`	VARCHAR(8), `var_11:00:00`	VARCHAR(8), `var_11:15:00`	VARCHAR(8), `var_11:30:00`	VARCHAR(8), `var_11:45:00`	VARCHAR(8), `var_12:00:00`	VARCHAR(8), `var_12:15:00`	VARCHAR(8), `var_12:30:00`	VARCHAR(8), `var_12:45:00`	VARCHAR(8), `var_13:00:00`	VARCHAR(8), `var_13:15:00`	VARCHAR(8), `var_13:30:00`	VARCHAR(8), `var_13:45:00`	VARCHAR(8), `var_14:00:00`	VARCHAR(8), `var_14:15:00`	VARCHAR(8), `var_14:30:00`	VARCHAR(8), `var_14:45:00`	VARCHAR(8), `var_15:00:00`	VARCHAR(8), `var_15:15:00`	VARCHAR(8), `var_15:30:00`	VARCHAR(8), `var_15:45:00`	VARCHAR(8), `var_16:00:00`	VARCHAR(8), `var_16:15:00`	VARCHAR(8), `var_16:30:00`	VARCHAR(8), `var_16:45:00`	VARCHAR(8), `var_17:00:00`	VARCHAR(8), `var_17:15:00`	VARCHAR(8), `var_17:30:00`	VARCHAR(8), `var_17:45:00`	VARCHAR(8), `var_18:00:00`	VARCHAR(8), `var_18:15:00`	VARCHAR(8), `var_18:30:00`	VARCHAR(8), `var_18:45:00`	VARCHAR(8), `var_19:00:00`	VARCHAR(8), `var_19:15:00`	VARCHAR(8), `var_19:30:00`	VARCHAR(8), `var_19:45:00`	VARCHAR(8), `var_20:00:00`	VARCHAR(8), `var_20:15:00`	VARCHAR(8), `var_20:30:00`	VARCHAR(8), `var_20:45:00`	VARCHAR(8), `var_21:00:00`	VARCHAR(8), `var_21:15:00`	VARCHAR(8), `var_21:30:00`	VARCHAR(8), `var_21:45:00`	VARCHAR(8), `var_22:00:00`	VARCHAR(8), `var_22:15:00`	VARCHAR(8), `var_22:30:00`	VARCHAR(8), `var_22:45:00`	VARCHAR(8), `var_23:00:00`	VARCHAR(8), `var_23:15:00`	VARCHAR(8), `var_23:30:00`	VARCHAR(8), `var_23:45:00`	VARCHAR(8))
BEGIN
-- Importar datos de CCPulse a la tabla ccpulseintro
/*INSERT INTO `ccpulseintro`*/
INSERT INTO `ccpulseintro`
(`objetivo`, `statisc`, `fecha`, `00:00:00`, `00:15:00`, `00:30:00`, `00:45:00`, `01:00:00`, `01:15:00`, `01:30:00`, `01:45:00`, `02:00:00`, `02:15:00`, `02:30:00`, `02:45:00`, `03:00:00`, `03:15:00`, `03:30:00`, `03:45:00`, `04:00:00`, `04:15:00`, `04:30:00`, `04:45:00`, `05:00:00`, `05:15:00`, `05:30:00`, `05:45:00`, `06:00:00`, `06:15:00`, `06:30:00`, `06:45:00`, `07:00:00`, `07:15:00`, `07:30:00`, `07:45:00`, `08:00:00`, `08:15:00`, `08:30:00`, `08:45:00`, `09:00:00`, `09:15:00`, `09:30:00`, `09:45:00`, `10:00:00`, `10:15:00`, `10:30:00`, `10:45:00`, `11:00:00`, `11:15:00`, `11:30:00`, `11:45:00`, `12:00:00`, `12:15:00`, `12:30:00`, `12:45:00`, `13:00:00`, `13:15:00`, `13:30:00`, `13:45:00`, `14:00:00`, `14:15:00`, `14:30:00`, `14:45:00`, `15:00:00`, `15:15:00`, `15:30:00`, `15:45:00`, `16:00:00`, `16:15:00`, `16:30:00`, `16:45:00`, `17:00:00`, `17:15:00`, `17:30:00`, `17:45:00`, `18:00:00`, `18:15:00`, `18:30:00`, `18:45:00`, `19:00:00`, `19:15:00`, `19:30:00`, `19:45:00`, `20:00:00`, `20:15:00`, `20:30:00`, `20:45:00`, `21:00:00`, `21:15:00`, `21:30:00`, `21:45:00`, `22:00:00`, `22:15:00`, `22:30:00`, `22:45:00`, `23:00:00`, `23:15:00`, `23:30:00`, `23:45:00`)
VALUES
(`var_objetivo`, `var_statisc`, `var_fecha`, `var_00:00:00`, `var_00:15:00`, `var_00:30:00`, `var_00:45:00`, `var_01:00:00`, `var_01:15:00`, `var_01:30:00`, `var_01:45:00`, `var_02:00:00`, `var_02:15:00`, `var_02:30:00`, `var_02:45:00`, `var_03:00:00`, `var_03:15:00`, `var_03:30:00`, `var_03:45:00`, `var_04:00:00`, `var_04:15:00`, `var_04:30:00`, `var_04:45:00`, `var_05:00:00`, `var_05:15:00`, `var_05:30:00`, `var_05:45:00`, `var_06:00:00`, `var_06:15:00`, `var_06:30:00`, `var_06:45:00`, `var_07:00:00`, `var_07:15:00`, `var_07:30:00`, `var_07:45:00`, `var_08:00:00`, `var_08:15:00`, `var_08:30:00`, `var_08:45:00`, `var_09:00:00`, `var_09:15:00`, `var_09:30:00`, `var_09:45:00`, `var_10:00:00`, `var_10:15:00`, `var_10:30:00`, `var_10:45:00`, `var_11:00:00`, `var_11:15:00`, `var_11:30:00`, `var_11:45:00`, `var_12:00:00`, `var_12:15:00`, `var_12:30:00`, `var_12:45:00`, `var_13:00:00`, `var_13:15:00`, `var_13:30:00`, `var_13:45:00`, `var_14:00:00`, `var_14:15:00`, `var_14:30:00`, `var_14:45:00`, `var_15:00:00`, `var_15:15:00`, `var_15:30:00`, `var_15:45:00`, `var_16:00:00`, `var_16:15:00`, `var_16:30:00`, `var_16:45:00`, `var_17:00:00`, `var_17:15:00`, `var_17:30:00`, `var_17:45:00`, `var_18:00:00`, `var_18:15:00`, `var_18:30:00`, `var_18:45:00`, `var_19:00:00`, `var_19:15:00`, `var_19:30:00`, `var_19:45:00`, `var_20:00:00`, `var_20:15:00`, `var_20:30:00`, `var_20:45:00`, `var_21:00:00`, `var_21:15:00`, `var_21:30:00`, `var_21:45:00`, `var_22:00:00`, `var_22:15:00`, `var_22:30:00`, `var_22:45:00`, `var_23:00:00`, `var_23:15:00`, `var_23:30:00`, `var_23:45:00` );

SELECT COUNT(*) as 'total', `fecha` as 'actualizado', 'ccpulse' as 'type' FROM `ccpulseintro` WHERE `fecha` >= `var_fecha`;
END