const { models } = require("../data/sequelize");

async function loadOrganizationData() {
  await models.Organization.findOrCreate({
    where: { name: "ANCESTRY" },
    defaults: { name: "ANCESTRY" },
  });
  await models.Organization.findOrCreate({
    where: { name: "AGRICULTURE" },
    defaults: { name: "AGRICULTURE" },
  });
  await models.Organization.findOrCreate({
    where: { name: "BANKING" },
    defaults: { name: "BANKING" },
  });
  await models.Organization.findOrCreate({
    where: { name: "COMMERCE" },
    defaults: { name: "COMMERCE" },
  });
  await models.Organization.findOrCreate({
    where: { name: "EDUCATION" },
    defaults: { name: "EDUCATION" },
  });
  await models.Organization.findOrCreate({
    where: { name: "TREASURY" },
    defaults: { name: "TREASURY" },
  });
  const [organization, created] = await models.Organization.findOrCreate({
    where: { name: "DNI" },
    defaults: { name: "DNI" },
  });

  return organization;
}

async function loadUserData(organization) {
  await models.User.findOrCreate({
    where: {
      userName: "alvaram",
    },
    defaults: {
      fullName: "Alvaro Ramirez",
      firstName: "Alvaro",
      lastName: "Ramirez",
      userName: "alvaram",
      enabled: true,
      dn: "O=udev2dev.com,OU=maximus,CN=alvaram",
      email: "alvaram@example.com",
      roles: ["wire_editor", "community_editor"],
      organizationId: organization.id,
    },
  });

  await models.User.findOrCreate({
    where: {
      userName: "juliluc",
    },
    defaults: {
      fullName: "Julie Luckanavage",
      firstName: "Julie",
      lastName: "Luckanavage",
      userName: "juliluc",
      enabled: true,
      dn: "O=udev2dev.com,OU=maximus,CN=juliluc",
      email: "juliluc@example.com",
      roles: ["wire_editor", "community_editor"],
      organizationId: organization.id,
    },
  });

  await models.User.findOrCreate({
    where: {
      userName: "rodotor",
    },
    defaults: {
      fullName: "Rodolfo Torres",
      firstName: "Roldolfo",
      lastName: "Torres",
      userName: "rodotor",
      enabled: true,
      dn: "O=udev2dev.com,OU=maximus,CN=rodotor",
      email: "rodotor@example.com",
      roles: ["wire_editor", "community_editor"],
      organizationId: organization.id,
    },
  });

  await models.User.findOrCreate({
    where: {
      userName: "kevibeh",
    },
    defaults: {
      fullName: "Kevin Behr",
      firstName: "Kevin",
      lastName: "Behr",
      userName: "kevibeh",
      enabled: true,
      dn: "O=udev2dev.com,OU=maximus,CN=kevibeh",
      email: "kevibeh@example.com",
      roles: ["wire_editor", "community_editor"],
      organizationId: organization.id,
    },
  });

  await models.User.findOrCreate({
    where: {
      userName: "danikol",
    },
    defaults: {
      fullName: "Daniel Kolb",
      firstName: "Daniel",
      lastName: "Kolb",
      userName: "danikol",
      enabled: true,
      dn: "O=udev2dev.com,OU=maximus,CN=danikol",
      email: "danikol@example.com",
      roles: ["wire_editor", "community_editor", "special_edition_manager"],
      organizationId: organization.id,
    },
  });

  await models.User.findOrCreate({
    where: {
      userName: "chriroh",
    },
    defaults: {
      fullName: "Christopher Rohr",
      firstName: "Christopher",
      lastName: "Rohr",
      userName: "chriroh",
      enabled: true,
      dn: "O=udev2dev.com,OU=maximus,CN=chriroh",
      email: "chriroh@example.com",
      roles: ["wire_editor", "community_editor"],
      organizationId: organization.id,
    },
  });

  await models.User.findOrCreate({
    where: {
      userName: "timocor",
    },
    defaults: {
      fullName: "Timothy Corbitt",
      firstName: "Timothy",
      lastName: "Corbitt",
      userName: "timocor",
      enabled: true,
      dn: "O=udev2dev.com,OU=maximus,CN=timocor",
      email: "timocor@example.com",
      roles: ["wire_editor", "community_editor"],
      organizationId: organization.id,
    },
  });

  await models.User.findOrCreate({
    where: {
      userName: "kylemue",
    },
    defaults: {
      fullName: "M Kyle Mueller",
      firstName: "M Kyle",
      lastName: "Mueller",
      userName: "kylemue",
      enabled: true,
      dn: "O=udev2dev.com,OU=maximus,CN=kylemue",
      email: "kylemue@example.com",
      roles: ["wire_editor", "community_editor"],
      organizationId: organization.id,
    },
  });

  await models.User.findOrCreate({
    where: {
      userName: "brentay",
    },
    defaults: {
      fullName: "Brent Taylor",
      firstName: "Brent",
      lastName: "Taylor",
      userName: "brentay",
      enabled: true,
      dn: "O=udev2dev.com,OU=maximus,CN=brentay",
      email: "brentay@example.com",
      roles: ["wire_editor", "community_editor"],
      organizationId: organization.id,
    },
  });

  await models.User.findOrCreate({
    where: {
      userName: "amangil",
    },
    defaults: {
      fullName: "Amanda Gilbreath",
      firstName: "Amanda",
      lastName: "Gilbreath",
      userName: "amangil",
      enabled: true,
      dn: "O=udev2dev.com,OU=maximus,CN=amangil",
      email: "amangil@example.com",
      roles: ["wire_editor", "community_editor"],
      organizationId: organization.id,
    },
  });

  await models.User.findOrCreate({
    where: {
      userName: "damimil",
    },
    defaults: {
      fullName: "Damion Miles",
      firstName: "Damion",
      lastName: "Miles",
      userName: "damimil",
      enabled: true,
      dn: "O=udev2dev.com,OU=maximus,CN=damimil",
      email: "damimil@example.com",
      roles: ["wire_editor", "community_editor"],
      organizationId: organization.id,
    },
  });

  await models.User.findOrCreate({
    where: {
      userName: "jonaosz",
    },
    defaults: {
      fullName: "Jonathan Oszczakiewicz",
      firstName: "Jonathan",
      lastName: "Oszczakiewicz",
      userName: "jonaosz",
      enabled: true,
      dn: "O=udev2dev.com,OU=maximus,CN=jonaosz",
      email: "jonaosz@example.com",
      roles: ["wire_editor", "community_editor"],
      organizationId: organization.id,
    },
  });

  await models.User.findOrCreate({
    where: {
      userName: "kevihad",
    },
    defaults: {
      fullName: "Kevin Nguyen",
      firstName: "Kevin",
      lastName: "Nguyen",
      userName: "kevihad",
      enabled: true,
      dn: "O=udev2dev.com,OU=maximus,CN=kevihad",
      email: "kevihad@example.com",
      roles: ["wire_editor", "community_editor"],
      organizationId: organization.id,
    },
  });

  await models.User.findOrCreate({
    where: {
      userName: "jerekim",
    },
    defaults: {
      fullName: "Jeremiah Kim",
      firstName: "Jeremiah",
      lastName: "Kim",
      userName: "jerekim",
      enabled: true,
      dn: "O=udev2dev.com,OU=maximus,CN=jerekim",
      email: "jerekim@example.com",
      roles: ["wire_editor", "community_editor"],
      organizationId: organization.id,
    },
  });

  await models.User.findOrCreate({
    where: {
      userName: "joonkim",
    },
    defaults: {
      fullName: "Joon Kim",
      firstName: "Joon",
      lastName: "Kim",
      userName: "joonkim",
      enabled: true,
      dn: "O=udev2dev.com,OU=maximus,CN=joonkim",
      email: "joonkim@example.com",
      roles: ["wire_editor", "community_editor"],
      organizationId: organization.id,
    },
  });

  await models.User.findOrCreate({
    where: {
      userName: "scotbea",
    },
    defaults: {
      fullName: "Scott Bearden",
      firstName: "Scott",
      lastName: "Bearden",
      userName: "scotbea",
      enabled: true,
      dn: "O=udev2dev.com,OU=maximus,CN=scotbea",
      email: "scotbea@example.com",
      roles: ["wire_editor", "community_editor"],
      organizationId: organization.id,
    },
  });
}

async function loadFeedData() {
  await models.Feed.findOrCreate({
    where: {
      searchParams: "https://localhost:8443/search?text=test1",
    },
    defaults: {
      name: "Test Feed #1",
      searchParams: "https://localhost:8443/search?text=test1",
      state: "Draft",
      classification: "UNCLASSIFIED",
    },
  });

  await models.Feed.findOrCreate({
    where: {
      searchParams: "https://localhost:8443/search?text=test2",
    },
    defaults: {
      name: "Test Feed #2",
      searchParams: "https://localhost:8443/search?text=test2",
      state: "Posted",
      classification: "UNCLASSIFIED",
    },
  });

  await models.Feed.findOrCreate({
    where: {
      searchParams: "https://localhost:8443/search?text=test3",
    },
    defaults: {
      name: "Test Feed #3",
      searchParams: "https://localhost:8443/search?text=test3",
      state: "Archived",
      classification: "UNCLASSIFIED",
    },
  });
}

module.exports = {
  loadUserData,
  loadOrganizationData,
  loadFeedData,
};
