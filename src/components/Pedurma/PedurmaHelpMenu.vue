<template>
  <q-btn flat color="grey" icon="help">
    <q-menu>
      <q-list style="min-width: 100px">
        <q-item
          clickable
          v-close-popup
          @click="
            openURL(
              'https://docs.google.com/document/d/1Ob9-brku7NvKSQHm8DwYbYPnHX4tJtJDD_2gwFIXQ5w/edit?usp=sharing'
            )
            "
        >
          <q-item-section side>
            <q-icon name="description" />
          </q-item-section>
          <q-item-section>Guide</q-item-section>
        </q-item>
        <q-item
          clickable
          v-close-popup
          @click="openURL('https://github.com/OpenPecha-dev/openpecha-editor/issues/new')"

        >
          <q-item-section side>
            <q-icon name="report_problem" />
          </q-item-section>
          <q-item-section>Report Issue</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script>

import { openURL } from "quasar"

export default {
  name: 'PedurmaHelpMenu',
  methods: {
    openURL(url) {
      openURL(url)
    }
  }
}
</script>
