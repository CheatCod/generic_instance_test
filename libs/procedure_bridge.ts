declare const Deno: any;
import { ProcedureCallResultIR } from "./bindings/ProcedureCallResultIR";
import { GenericSetupConfig } from "./bindings/GenericSetupConfig";
import { ProcedureCall } from "./bindings/ProcedureCall";
import { get_state, kill_instance, monitor, send_command, setup_instance, start_instance, stop_instance } from "../implementation/server";
const emit_result = (result: ProcedureCallResultIR) => Deno.core.ops.emit_result(result);

export async function procedure_bridge() {
    // This function will throw if it's called more than once.
    Deno.core.ops.proc_bridge_ready();
    while (true) {
        const procedure: ProcedureCall = await Deno.core.ops.on_procedure();
        if (procedure.inner.type === "SetupInstance") {
            setup_instance(procedure.inner.config as GenericSetupConfig).then(() => {
                emit_result(
                    {
                        id: procedure.id,
                        success: true,
                        procedure_call_kind: "SetupInstance",
                        inner: "Void",
                        error: null
                    }
                )
            }).catch((e) => {
                emit_result(
                    {
                        id: procedure.id,
                        success: false,
                        procedure_call_kind: "SetupInstance",
                        inner: null,
                        error: {
                            kind: "Internal",
                            source: e.toString()
                        }
                    }
                )
            });
        } else if (procedure.inner.type === "StartInstance") {
            start_instance(procedure.inner.caused_by).then(() => {
                emit_result(
                    {
                        id: procedure.id,
                        success: true,
                        procedure_call_kind: "StartInstance",
                        inner: "Void",
                        error: null
                    }
                )
            }).catch((e) => {
                emit_result(
                    {
                        id: procedure.id,
                        success: false,
                        procedure_call_kind: "StartInstance",
                        inner: null,
                        error: {
                            kind: "Internal",
                            source: e.toString()
                        }
                    }
                )
            });
        } else if (procedure.inner.type === "StopInstance") {
            stop_instance(procedure.inner.caused_by).then(() => {
                emit_result(
                    {
                        id: procedure.id,
                        success: true,
                        procedure_call_kind: "StopInstance",
                        inner: "Void",
                        error: null
                    }
                )
            }).catch((e) => {
                emit_result(
                    {
                        id: procedure.id,
                        success: false,
                        procedure_call_kind: "StopInstance",
                        inner: null,
                        error: {
                            kind: "Internal",
                            source: e.toString()
                        }
                    }
                )
            });
        } else if (procedure.inner.type === "KillInstance") {
            kill_instance(procedure.inner.caused_by).then(() => {
                emit_result(
                    {
                        id: procedure.id,
                        success: true,
                        procedure_call_kind: "KillInstance",
                        inner: "Void",
                        error: null
                    }
                )
            }
            ).catch((e) => {
                emit_result(
                    {
                        id: procedure.id,
                        success: false,
                        procedure_call_kind: "KillInstance",
                        inner: null,
                        error: {
                            kind: "Internal",
                            source: e.toString()
                        }
                    }
                )
            }
            );
        } else if (procedure.inner.type === "GetState") {
            get_state().then((result) => {
                emit_result(
                    {
                        id: procedure.id,
                        success: true,
                        procedure_call_kind: "GetState",
                        inner: {
                            State: result
                        },
                        error: null
                    }
                )
            }
            ).catch((e) => {
                emit_result(
                    {
                        id: procedure.id,
                        success: false,
                        procedure_call_kind: "GetState",
                        inner: null,
                        error: {
                            kind: "Internal",
                            source: e.toString()
                        }
                    }
                )
            }
            );
        } else if (procedure.inner.type === "SendCommand") {
            send_command(procedure.inner.command, procedure.inner.caused_by).then((result) => {
                if (result) {
                    emit_result(
                        {
                            id: procedure.id,
                            success: true,
                            procedure_call_kind: "SendCommand",
                            inner: {
                                String: result
                            },
                            error: null
                        }
                    )
                } else {
                    emit_result(
                        {
                            id: procedure.id,
                            success: true,
                            procedure_call_kind: "SendCommand",
                            inner: "Void",
                            error: null
                        }
                    )
                }
            }
            ).catch((e) => {
                emit_result(
                    {
                        id: procedure.id,
                        success: false,
                        procedure_call_kind: "SendCommand",
                        inner: null,
                        error: {
                            kind: "Internal",
                            source: e.toString()
                        }
                    }
                )
            }
            );
        } else if (procedure.inner.type === "Monitor") {
            monitor().then((result) => {
                emit_result(
                    {
                        id: procedure.id,
                        success: true,
                        procedure_call_kind: "Monitor",
                        inner: {
                            Monitor: result
                        },
                        error: null
                    }
                )
            }
            ).catch((e) => {
                emit_result(
                    {
                        id: procedure.id,
                        success: false,
                        procedure_call_kind: "Monitor",
                        inner: null,
                        error: {
                            kind: "Internal",
                            source: e.toString()
                        }
                    }
                )
            }
            );
        }
    }
}
