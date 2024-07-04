import { Group, ActionIcon, rem,Image } from '@mantine/core';
import { IconBrandTwitter, IconBrandYoutube, IconBrandInstagram } from '@tabler/icons-react';
import logo from '../../assets/logo.png'; // Replace with your logo path

export function FooterCentered() {


  return (
    <div style={{
      padding: '0.5rem',
      borderTop: '1px solid black'
    
    }}>
      <div style={{
        display: 'flex',
  justifyContent: 'space-between',
        alignItems: 'center'
        
        
      }} >
        
            <Image src={logo} height={30} width={30} />

        <Group>navriti technologies pvt ltd</Group>

        <Group gap="xs" justify="flex-end" wrap="nowrap">
          <ActionIcon size="lg" variant="default" radius="xl">
            <IconBrandTwitter style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
          </ActionIcon>
          <ActionIcon size="lg" variant="default" radius="xl">
            <IconBrandYoutube style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
          </ActionIcon>
          <ActionIcon size="lg" variant="default" radius="xl">
            <IconBrandInstagram style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
          </ActionIcon>
        </Group>
      </div>
    </div>
  );
}