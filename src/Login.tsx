"use client";

import { useToggle, upperFirst } from "@mantine/hooks";
import { useMantineTheme } from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  Button,
  Divider,
  Anchor,
  Stack,
} from "@mantine/core";
import { SupabaseClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export function AuthenticationForm({ client }: { client: SupabaseClient }) {
  const theme = useMantineTheme();

  async function login(
    client: SupabaseClient,
    formData: { email: string; password: string }
  ) {
    const data = {
      email: formData.email,
      password: formData.password,
    };

    const { error } = await client.auth.signInWithPassword(data);

    if (error) {
      redirect("/error");
    }

    redirect("/");
  }

  const [type, toggle] = useToggle(["login", "register"]);
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) =>
        val.length <= 6
          ? "Password should include at least 6 characters"
          : null,
    },
  });

  return (
    <Paper radius="xl" p="md" withBorder>
      <div style={{ textAlign: "center" }}>
        <Text size="md" fw={500}>
          Welcome to Pomo
        </Text>
        <Text size="xs">A simple pomodoro timer</Text>
      </div>

      <form
        onSubmit={form.onSubmit((values) => {
          login(client, values);
        })}
      >
        <Stack gap="xs">
          <TextInput
            required
            label="Email"
            placeholder="hello@pomo.dev"
            value={form.values.email}
            onChange={(event) =>
              form.setFieldValue("email", event.currentTarget.value)
            }
            error={form.errors.email && "Invalid email"}
            size="xs"
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            value={form.values.password}
            onChange={(event) =>
              form.setFieldValue("password", event.currentTarget.value)
            }
            error={
              form.errors.password &&
              "Password should include at least 6 characters"
            }
            size="xs"
          />
        </Stack>

        <Group justify="space-between" mt="xl">
          <Anchor
            component="button"
            type="button"
            c="dimmed"
            onClick={() => toggle()}
            size="xs"
          >
            {type === "register"
              ? "Already have an account? Login"
              : "Don't have an account? Register"}
          </Anchor>
          <Button type="submit" radius="xl" size="xs">
            {upperFirst(type)}
          </Button>
        </Group>
      </form>
      <Divider
        label={
          <Group justify="center" gap={"0.3rem"}>
            <Text size="xs">Or</Text>
            <Anchor
              component="button"
              type="button"
              c={theme.colors.myGreen[6]}
              size="xs"
            >
              continue locally
            </Anchor>
          </Group>
        }
        labelPosition="center"
        my="lg"
      />
    </Paper>
  );
}
