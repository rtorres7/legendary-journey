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
      cn: "Alvaro Ramirez",
      email: "alvaram@example.com",
      roles: ["wire_editor", "community_editor", "special_edition_manager"],
      organizationId: organization.id,
      hasOrg: true,
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
      cn: "Julie Luckanavage",
      email: "juliluc@example.com",
      roles: ["wire_editor", "community_editor", "special_edition_manager"],
      organizationId: organization.id,
      hasOrg: true,
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
      cn: "Rodolfo Torres",
      email: "rodotor@example.com",
      roles: ["wire_editor", "community_editor", "special_edition_manager"],
      organizationId: organization.id,
      hasOrg: true,
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
      cn: "Kevin Behr",
      email: "kevibeh@example.com",
      roles: ["wire_editor", "community_editor", "special_edition_manager"],
      organizationId: organization.id,
      hasOrg: true,
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
      cn: "Daniel Kolb",
      email: "danikol@example.com",
      roles: ["wire_editor", "community_editor", "special_edition_manager"],
      organizationId: organization.id,
      hasOrg: true,
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
      cn: "Christopher Rohr",
      email: "chriroh@example.com",
      roles: ["wire_editor", "community_editor", "special_edition_manager"],
      organizationId: organization.id,
      hasOrg: true,
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
      cn: "Timothy Corbitt",
      email: "timocor@example.com",
      roles: ["wire_editor", "community_editor", "special_edition_manager"],
      organizationId: organization.id,
      hasOrg: true,
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
      cn: "Kyle Mueller",
      email: "kylemue@example.com",
      roles: ["wire_editor", "community_editor", "special_edition_manager"],
      organizationId: organization.id,
      hasOrg: true,
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
      cn: "Brent Taylor",
      email: "brentay@example.com",
      roles: ["wire_editor", "community_editor", "special_edition_manager"],
      organizationId: organization.id,
      hasOrg: true,
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
      cn: "Amanda Gilbreath",
      email: "amangil@example.com",
      roles: ["wire_editor", "community_editor", "special_edition_manager"],
      organizationId: organization.id,
      hasOrg: true,
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
      cn: "Damion Miles",
      email: "damimil@example.com",
      roles: ["wire_editor", "community_editor", "special_edition_manager"],
      organizationId: organization.id,
      hasOrg: true,
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
      cn: "Jonathan Oszczakiewicz",
      email: "jonaosz@example.com",
      roles: ["wire_editor", "community_editor", "special_edition_manager"],
      organizationId: organization.id,
      hasOrg: true,
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
      cn: "Kevin Nguyen",
      email: "kevihad@example.com",
      roles: ["wire_editor", "community_editor", "special_edition_manager"],
      organizationId: organization.id,
      hasOrg: true,
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
      cn: "Jeremiah Kim",
      email: "jerekim@example.com",
      roles: ["wire_editor", "community_editor", "special_edition_manager"],
      organizationId: organization.id,
      hasOrg: true,
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
      cn: "Joon Kim",
      email: "joonkim@example.com",
      roles: ["wire_editor", "community_editor", "special_edition_manager"],
      organizationId: organization.id,
      hasOrg: true,
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
      cn: "Scott Bearden",
      email: "scotbea@example.com",
      roles: ["wire_editor", "community_editor", "special_edition_manager"],
      organizationId: organization.id,
      hasOrg: true,
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
      selectedReadings: "WIReWIRe_sample_1",
      state: "Draft",
      position: 1,
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
      selectedReadings: "WIReWIRe_sample_2",
      state: "Posted",
      position: 2,
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
      selectedReadings: "WIReWIRe_sample_3",
      state: "Archived",
      position: 3,
      classification: "UNCLASSIFIED",
    },
  });
}

module.exports = {
  loadUserData,
  loadOrganizationData,
  loadFeedData,
};
