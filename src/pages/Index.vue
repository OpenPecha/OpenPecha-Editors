<template>
  <q-page padding>
    OpenPecha Landing Page
    <div class="col-md-2 mb-3">
      <img
        :src="$auth.user.picture"
        alt="User's profile picture"
        class="rounded-circle img-fluid profile-picture"
      />
    </div>
    <div class="col-md text-center text-md-left">
      <h2>{{ $auth.user.name }}</h2>
      <p class="lead text-muted">{{ $auth.user.email }}</p>
    </div>

    <div class="row">
      <pre class="col-12 text-light bg-dark p-4">{{
        JSON.stringify($auth.user, null, 2)
      }}</pre>
    </div>
  </q-page>
</template>

<script>
export default {
  name: "Index",
};
</script>
