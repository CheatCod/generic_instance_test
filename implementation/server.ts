import { CausedBy } from "../libs/bindings/CausedBy"
import { GenericSetupConfig } from "../libs/bindings/GenericSetupConfig"
import { InstanceState } from "../libs/bindings/InstanceState"
import { PerformanceReport } from "../libs/bindings/PerformanceReport"
import { readLines } from "https://deno.land/std@0.104.0/io/mod.ts";

let config : GenericSetupConfig;
let process;
export async function setup_instance(setupConfig: GenericSetupConfig) {
    config = setupConfig;
    // throw new Error('Not implemented')
}

export async function start_instance(caused_by: CausedBy) {
    // open /home/peter/dev/backend/generic_instance_test/launch.sh with sh and get output
    process = Deno.run({
        cmd : [
            "sh",
            "/home/peter/dev/backend/generic_instance_test/launch.sh"
        ],
        stdout: "piped",
        stdin : "piped",
        stderr: "piped"
    });
    // asynchronously read output line by line and print it

    const task = async () => {
        for await (const line of readLines(process.stdout)) {
            Deno.core.ops.emit_console_out(line);
        }
    };

    task();
}

export async function stop_instance(caused_by: CausedBy) {
    throw new Error('Not implemented')
}

export async function kill_instance(caused_by: CausedBy) {
    process.kill()
}

export async function get_state(): Promise<InstanceState> {
    throw new Error('Not implemented')
}

export async function send_command(command: string, caused_by: CausedBy): Promise<string | undefined> {
    throw new Error('Not implemented')
}

export async function monitor() : Promise<PerformanceReport> {
    throw new Error('Not implemented')
}